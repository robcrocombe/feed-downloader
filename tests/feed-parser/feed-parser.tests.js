import fs from 'fs';
import moment from 'moment';
import parseSyndicationFeed from '../../src/feed-parser';

const expect = global.expect;
const TEST_FEEDS_DIRECTORY = './tests/syndication-feeds/';

function loadTestSyndicationFeed(type, name) {
  return fs.readFileSync(`${TEST_FEEDS_DIRECTORY}${type}/${name}.${type}`, { encoding: 'utf8' });
}

describe('feed-parser', () => {
  describe('parseSyndicationFeed(feedString)', () => {
    it('should throw if feedString is null, empty or not a string', () =>
      Promise.all([
        expect(parseSyndicationFeed(null)).to.be.rejectedWith('Valid RSS/ATOM Required'),
        expect(parseSyndicationFeed('')).to.be.rejectedWith('Valid RSS/ATOM Required'),
        expect(parseSyndicationFeed(1)).to.be.rejectedWith('Valid RSS/ATOM Required')
      ])
    );

    it('should throw if feedString is not a valid XML document', () =>
      Promise.all([
        expect(parseSyndicationFeed('{data: \'This is JSON not XML\'}')).to.be.rejectedWith('Valid RSS/ATOM Required'),
        expect(parseSyndicationFeed('<?xml version = "1.0"?><data><<</data>')).to.be.rejectedWith('Valid RSS/ATOM Required')
      ])
    );

    it('should correctly parse minimum.rss', () => {
      const minimumRSS = loadTestSyndicationFeed('rss', 'minimum');
      const expectedItems = [
        {
          title: 'You won\'t believe what happened next!',
          link: 'http://example.com/what-happened-next',
          description: 'Something uninteresting, you got click baited!'
        },
        {
          title: 'Blog Authors hate him!',
          link: 'http://example.com/blog-authors-hate-him'
        }
      ];
      return expect(parseSyndicationFeed(minimumRSS)).to.eventually.deep.equal(expectedItems);
    });

    it('should correctly parse blogger.atom', () => {
      const bloggerATOM = loadTestSyndicationFeed('atom', 'blogger');
      const expectedItems = [
        {
          title: 'Graphics Work',
          link: 'http://richardbamford.blogspot.com/2016/02/graphics-work.html',
          description: 'A quick update on what I\'ve been working on recently.For one of my modules Simulations and 3D Graphics, we were set a task to learn lighting and materials. So far I have implemented a single light, using ADS and blinn-phong (again).The camera can rotate, move forward/backward. The armadillo can be rotated on it\'s pedestal and the whole scene can be rotated.',
          // imageURI: 'https://1.bp.blogspot.com/-74kEkoti2zU/Vs84kp7mLdI/AAAAAAAAEM0/MFcbjuNxPM8/s1600/2016-02-25_17-18-06.png',
          dateUpdated: moment(new Date('2016-02-25T09:25:27.716-08:00')),
          datePublished: moment(new Date('2016-02-25T09:25:00.001-08:00'))
        },
        {
          title: 'Project 5: Stanford dragon rendering',
          link: 'http://richardbamford.blogspot.com/2016/02/project-5-stanford-dragon-rendering.html',
          description: 'This dragon is one of the many models which the Stanford University Computer Graphics Laboratory scanned. More info http://graphics.stanford.edu/data/3Dscanrep/. I used this to practice for an upcoming module, it is made in OpenTK and uses OpenGL 4.5.  Work for this included:Loading vertex and normal data from .OBJ.Parsing material file for Blinn-Phong attributes.Blinn-Phong glsl shaders.Setting model/view/projection matrices.Configuring camera and light positions.',
          dateUpdated: moment(new Date('2016-02-07T07:52:10.279-08:00')),
          datePublished: moment(new Date('2016-02-07T07:52:00.000-08:00'))
        },
        {
          title: 'Project 4: Ray casting with a 2d graphics library.',
          link: 'http://richardbamford.blogspot.com/2016/02/project-4-ray-casting-with-2d-graphics.html',
          description: 'Implementing this using one of my favorite frameworks (https://love2d.org/) in Lua was a lot of fun!This is heavily inspired by Wolfenstein 3D.It involved simple trigonometry, calculating ray/shape intersections, figuring out how to map textures and lighting effects. A problem I encountered was a fisheye lens effect, because for each ray projected into the world, I would map the intersection distance directly to the height a wall (which is a group of line slices). However what I needed to do was calculate the perpendicular distance of the intersection using the projection plane as a reference. Here\'s a great image which helped me understand the problem a lot, originally my raycasting method resembled the one of the far right. Here are the resources I used: http://permadi.com/1996/05/ray-casting-tutorial-table-of-contents/ - Help with the projection plane/intersection distance calculation. https://en.wikipedia.org/wiki/Linear_interpolation - How I map the texture coordinates onto the side of a shape given a set of intersections with it.',
          imageURI: 'http://3.bp.blogspot.com/-9cjtEfP2sQo/VrDLiMCoUyI/AAAAAAAAEMI/qyUEqsLw1GA/s640/love_2016-02-01_14-32-10.png',
          dateUpdated: moment(new Date('2016-02-02T07:43:29.194-08:00')),
          datePublished: moment(new Date('2016-02-02T07:34:00.000-08:00'))
        },
        {
          title: 'Project 3: Grass Sim',
          link: 'http://richardbamford.blogspot.com/2016/01/project-3-grass-sim.html',
          description: 'Overview One of the main problems with rendering lots of primitives, is each one requires its own draw call/position definition.A solution to this is instanced rendering, where you give opengl a set of vertices and tell it to render it X amount of times. Since it computes everything internally from then on the cost of it is near 0.Instanced rendering does this (pseudo code):for 0, X doSet Instance IDDrawArrays/DrawElements.etcIn the form of this:GL.DrawArraysInstanced(PrimitiveType.Triangles, 0, 3, X);So now the fun part involves the shaders because each instance cannot be given a unique uniform value (which is what I do normally).Each instance has an ID from 0->X, utilising this in interesting ways allows you to produce cool effects for practically free.Here\'s what I came up with after playing around with it:Video after adding a time uniform: Vertex Shader DetailsTo distribute the triangles uniformly given a number from 0 -> 10,000.int x = int( mod( gl_InstanceID, 100 ) );int z = int( gl_InstanceID / 100 );To offset the period of each triangle\'s sin value (not worked out how to make fake-random numbers on shaders yet). Give uT as a value from 0, 2PI. Remember uT is defined once for all the \"grass\".float sVal = sin( gl_InstanceID + uT ); oDisplace = vec3( sVal, 0, 0 );ConclusionMy \"grass\" is nothing like grass yet, I\'ll be posting more in the next few days with any progress. I think colouring them is my next objective and then figuring out that tricky random displacement problem.Here\'s a download link if you want to give it a spin: LINK',
          // imageURI: 'http://3.bp.blogspot.com/-pEt7AB8J900/VppsrWFAGAI/AAAAAAAAELs/fgYESBcFvqU/s400/2016-01-16_15-59-50.png',
          dateUpdated: moment(new Date('2016-01-16T08:39:07.489-08:00')),
          datePublished: moment(new Date('2016-01-16T08:39:00.002-08:00'))
        },
        {
          title: 'Cloth Simulation Update',
          link: 'http://richardbamford.blogspot.com/2016/01/cloth-simulation-update.html',
          description: 'Some of the issues I found with the system since my last post:I assumed that all constraints had the same rest length, now it takes into account shear and linear constraint lengths.I only accounted for X,Y properties of each point which caused points to act strangely when close to each other, I have changed it to work in 3D. Although the view only looks 2D. Here\'s the result:',
          dateUpdated: moment(new Date('2016-01-14T06:08:11.487-08:00')),
          datePublished: moment(new Date('2016-01-14T06:08:00.000-08:00'))
        },
        {
          title: 'Project 2: Cloth Simulation',
          link: 'http://richardbamford.blogspot.com/2016/01/project-2-cloth-simulation.html',
          description: '',
          imageURI: 'http://3.bp.blogspot.com/-4jTmvI8SOGQ/VpUEH5zIxYI/AAAAAAAAELM/TXeyyIxPHxQ/s1600/Cloth_Simulation_2016-01-11_18-57-39.png',
          dateUpdated: moment(new Date('2016-01-12T06:18:16.008-08:00')),
          datePublished: moment(new Date('2016-01-12T06:11:00.001-08:00'))
        },
        {
          title: 'Sketchy physics simulations.',
          link: 'http://richardbamford.blogspot.com/2016/01/sketchy-physics.html',
          description: '',
          imageURI: 'http://2.bp.blogspot.com/-kTSC6ElMChI/VpF94IoG01I/AAAAAAAAELA/bXPdtZViKf8/s1600/12516658_10207946538003191_1669704460_o.jpg',
          dateUpdated: moment(new Date('2016-01-09T14:13:41.272-08:00')),
          datePublished: moment(new Date('2016-01-09T14:09:00.000-08:00'))
        },
        {
          title: 'OpenGL clipping technique.',
          link: 'http://richardbamford.blogspot.com/2016/01/opengl-clipping-technique.html',
          description: 'Part of the physics simulation I am working on at the moment involves cutting a cylinder in half, so that spheres have a defined space to interact but we can also view them.First I created a cylinder in 3ds max, with normals included. I didn\'t create the half cylinder because I want to have multiple cylinder objects for the spheres to collide with (also I was interested in the process).So I implemented an extra expression in my GLSL fragment shader, to say: If the X value (the camera looks down the X axis) of a fragment (in worldspace) is < 0 then discard that fragment.Initially, using the \`discard\` in-built function I got really strange results, with some fragments being removed and some staying. It looked like static on a TV.This problem was solved by implementing alpha blending, and setting the alpha value of fragments I want to discard to 0.0.This was great! however I wanted more control over the clipping (hardcoded at the time), so I decided to define a \"clipping plane\" (a vector which represents the normal of the plane).Then I find the cosine of the position of any given fragment (in world space) and that clipping plane normal. If that value < 0 then I know that that fragment is behind the \"face\" of the plane, so it can be discarded. Here\'s the GLSL code to implement that:    outColour.a = max(0.0, sign( dot( ClipPlane.xyz, vVaryingPos ) ) ); Where vVaryingPos is the position of the vertex in world space, computed in the vertex shader like:    vVaryingPos = ( modelMatrix * vec4( vVertex, 1.0 ) ).xyz;The resulting image was exactly the same, awesome! Now I can do funky things like...Due to face culling and the fact the cylinder only has normals facing inwards, when the back of the cylinder faces us, it isn\'t rendered! See here.',
          imageURI: 'http://3.bp.blogspot.com/-G3QD_xhi51Q/VpAhBHbFYMI/AAAAAAAAEKo/E8qryBiypFs/s1600/Falling_Spheres_%2528FPS_29.5528360379105%2529_2016-01-08_16-02-18.png',
          dateUpdated: moment(new Date('2016-01-08T13:04:24.160-08:00')),
          datePublished: moment(new Date('2016-01-08T13:04:00.002-08:00'))
        }
      ];
      return expect(parseSyndicationFeed(bloggerATOM)).to.eventually.deep.equal(expectedItems);
    });

    it('should correctly parse wordpress.com.rss', () => {
      const wordpressComRSS = loadTestSyndicationFeed('rss', 'wordpress.com');
      const expectedItems = [
        {
          title: 'Graduating from York',
          link: 'https://dannycomputerscientist.wordpress.com/2016/02/05/graduating-from-york/',
          description: 'On January 23rd I graduated with an MSc in Advanced Computer Science from The University of York. It was a nice occasion to get together and be merry with the family, and of course for some photos in my cap and gown — this time they were grey and blue. My parents took my degree',
          imageURI: 'https://dannycomputerscientist.files.wordpress.com/2016/02/img_0091.jpg',
          datePublished: moment(new Date('Fri, 05 Feb 2016 18:05:12 +0000'))
        },
        {
          title: 'HackTrain 2.0',
          link: 'https://dannycomputerscientist.wordpress.com/2016/01/10/hacktrain-2-0/',
          description: 'It seems like a lifetime ago, but the first HackTrain event was actually only 9 months ago — It probably feels so long ago to me as so much has change in the interim, including me getting a job as a result of the first event. When an opportunity came up to represent Trainline at',
          imageURI: 'https://dannycomputerscientist.files.wordpress.com/2015/12/12304083_786742814805282_703787864428458423_o.jpg',
          datePublished: moment(new Date('Sun, 10 Jan 2016 22:01:22 +0000'))
        },
        {
          title: 'Centre for Computing History',
          link: 'https://dannycomputerscientist.wordpress.com/2016/01/10/centre-for-computing-history/',
          description: 'Since September, Charlotte and I have lived about a minutes walk from the UK Computer Museum (which also seems to go by the name Centre for Computing History), but we’d never actually gone inside. Today after my flying lesson we went to have a quick look. Whilst it made me feel old to see things I',
          imageURI: 'https://dannycomputerscientist.files.wordpress.com/2016/01/bbc-micro.jpg',
          datePublished: moment(new Date('Sun, 10 Jan 2016 17:39:38 +0000'))
        },
        {
          title: 'Tracking Moving Trains (with the minimum possible effort)',
          link: 'https://dannycomputerscientist.wordpress.com/2015/12/22/tracking-moving-trains-with-minimum-possible-effort/',
          description: 'Trains are, in many respects, wonderful machines. They’re simultaneously both the most romantic form of travel and the most grueling way to get to work every morning. One thing trains are not however, is up-to-date with modern technology. Whilst you can follow the course, in real time, of a plane soaring at 36,000 feet above',
          imageURI: 'https://dannycomputerscientist.files.wordpress.com/2015/12/12106848_1494412047526257_4658382875925199724_n.jpg',
          datePublished: moment(new Date('Tue, 22 Dec 2015 01:52:55 +0000'))
        },
        {
          title: 'Captain Danny',
          link: 'https://dannycomputerscientist.wordpress.com/2015/12/09/captain-danny/',
          description: 'One of the nice things about working, opposed to studying, is that I now don’t feel guilty about not spending all my time working on coursework. Time for a hobby! Living 15 minutes walk from Cambridge Airport I quite often see people learning to fly, and thought it looked like fun — so decided to start',
          imageURI: 'https://dannycomputerscientist.files.wordpress.com/2015/12/img_05611.jpg',
          datePublished: moment(new Date('Wed, 09 Dec 2015 21:12:16 +0000'))
        },
        {
          title: 'Trainline at Silicon Milkroundabout',
          link: 'https://dannycomputerscientist.wordpress.com/2015/12/04/trainline-at-silicon-milkroundabout/',
          description: 'A few weeks ago I was lucky enought to be part of the team that tried, and hopefully succeeded, to entice more developers to come and work with us at Trainline at the Silicon Milkroundabout tech recruitment event. I really enjoy talking to people about technology and it was especially nice to talk to people who',
          imageURI: 'https://dannycomputerscientist.files.wordpress.com/2015/12/img_0521.jpg',
          datePublished: moment(new Date('Fri, 04 Dec 2015 23:12:03 +0000'))
        },
        {
          title: 'On-boarding at Trainline',
          link: 'https://dannycomputerscientist.wordpress.com/2015/10/29/on-boarding-at-trainline/',
          description: 'I’m now entering the sixth week of my time at Trainline. It’s been quite the experience, due to it being my first full-time job and it being a time of significant changes at Trainline in terms of technology, branding and even an expansion into the European rail market. It’s been great to be in a',
          imageURI: 'https://dannycomputerscientist.files.wordpress.com/2015/10/trainline-homepage.png',
          datePublished: moment(new Date('Thu, 29 Oct 2015 17:57:27 +0000'))
        },
        {
          title: 'MSc Finished',
          link: 'https://dannycomputerscientist.wordpress.com/2015/09/13/msc-finished/',
          description: 'Last week I submitted my thesis, workshop report and conference presentation for my MSc in Advanced Computer Science. Two days after my submission I was also required to present my research and answer a few questions fielded from a lecturer in Yorks Department of Computer Science who had not previously seen my work. The',
          datePublished: moment(new Date('Sun, 13 Sep 2015 01:13:58 +0000'))
        },
        {
          title: 'Expect the unexpected',
          link: 'https://dannycomputerscientist.wordpress.com/2015/08/02/expect-the-unexpected/',
          description: 'When you design software you usually have a few use cases in mind, in the case of EpsilonGit the use case I keep coming back to is a project lead who wants an overview of how his team is working and how they are using their version control software. Back in second year when I',
          imageURI: 'https://dannycomputerscientist.files.wordpress.com/2015/08/screen-shot-2015-08-02-at-21-16-29.png',
          datePublished: moment(new Date('Sun, 02 Aug 2015 20:19:55 +0000'))
        },
        {
          title: 'Thesis writing begins',
          link: 'https://dannycomputerscientist.wordpress.com/2015/07/27/thesis-writing-begins/',
          description: 'Today I started work on my masters thesis covering my research for and development of EpsilonGit. There’s no template provided for the layout of such reports, so today I’ve been sketching out a rough outline of what I hope to include in the report. e.g. Chapter names, section headings and comments for things to talk',
          imageURI: 'https://dannycomputerscientist.files.wordpress.com/2015/07/screen-shot-2015-07-27-at-22-02-20.png',
          datePublished: moment(new Date('Mon, 27 Jul 2015 21:13:14 +0000'))
        }
      ];
      return expect(parseSyndicationFeed(wordpressComRSS)).to.eventually.deep.equal(expectedItems);
    });
  });
});
