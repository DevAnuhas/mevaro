import { prisma } from "@/lib/prisma";
import { Category, MaterialStatus } from "@prisma/client";

async function main() {
    console.log('🌱 Starting seed process...');

    await prisma.material.deleteMany();
    console.log("All existing materials deleted.");

    // Create a demo user (uploader)
    const demoUser = await prisma.user.create({
        data: {
            email: 'demo@mevaro.edu',
            name: 'Demo User',
            emailVerified: true,
            role: 'user',
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mevaro',
        },
    });

    console.log('Demo user created:', demoUser.email);

    // Seed materials across STEAM categories
    const materials = [
        // SCIENCE Materials
        {
            title: 'Introduction to Photosynthesis',
            description: 'A comprehensive guide explaining how plants convert light energy into chemical energy through photosynthesis. Covers light-dependent and light-independent reactions, chloroplast structure, and the importance of photosynthesis in ecosystems.',
            fileUrl: 'https://pub-de18aed5649b4e8a852fdcf7ea3942e4.r2.dev/afc12e999014e4e0262db9c16f5aab2874a22d52514eb0ccec2e041051cefc6c.pdf',
            fileType: 'application/pdf',
            fileSize: 663220,
            category: Category.SCIENCE,
            keywords: ['biology', 'photosynthesis', 'plants', 'chlorophyll', 'ecology'],
            status: MaterialStatus.APPROVED,
            approvedAt: new Date(),
            uploaderId: demoUser.id,
        },
        {
            title: 'Chemical Bonding and Molecular Structure',
            description: 'Detailed exploration of ionic, covalent, and metallic bonds. Includes VSEPR theory, molecular geometry, and bond polarity with real-world applications in material science.',
            fileUrl: 'https://pub-de18aed5649b4e8a852fdcf7ea3942e4.r2.dev/a6a5633aa64aaac0e540ef62469fda173d4dcc281426c3d93de5dedb575326a6.pdf',
            fileType: 'application/pdf',
            fileSize: 714048,
            category: Category.SCIENCE,
            keywords: ['chemistry', 'bonds', 'molecules', 'atoms', 'VSEPR'],
            status: MaterialStatus.APPROVED,
            approvedAt: new Date(),
            uploaderId: demoUser.id,
        },
        {
            title: 'Newton\'s Laws of Motion',
            description: 'Interactive demonstrations and explanations of Newton\'s three laws of motion with practical examples from everyday life, sports, and space exploration.',
            fileUrl: 'https://pub-de18aed5649b4e8a852fdcf7ea3942e4.r2.dev/becd5689bdc29f717eced0b17d4e9eddd7e7f3ad7868927ace2eaef88ab14203.pdf',
            fileType: 'application/pdf',
            fileSize: 1736949,
            category: Category.SCIENCE,
            keywords: ['physics', 'newton', 'motion', 'force', 'mechanics'],
            status: MaterialStatus.APPROVED,
            approvedAt: new Date(),
            uploaderId: demoUser.id,
        },
        {
            title: 'Human Anatomy: The Circulatory System',
            description: 'Complete overview of the cardiovascular system including heart structure, blood vessels, blood composition, and the cardiac cycle. Features diagrams and interactive components.',
            fileUrl: 'https://pub-de18aed5649b4e8a852fdcf7ea3942e4.r2.dev/1245f1217922d4357285ccf2429fac064905e4d65b9a672e34c8bf07bb110f44.pdf',
            fileType: 'application/pdf',
            fileSize: 988524,
            category: Category.SCIENCE,
            keywords: ['anatomy', 'heart', 'blood', 'cardiovascular', 'health'],
            status: MaterialStatus.APPROVED,
            approvedAt: new Date(),
            uploaderId: demoUser.id,
        },

        // TECHNOLOGY Materials
        {
            title: 'Introduction to Cloud Computing',
            description: 'Comprehensive guide covering cloud service models (IaaS, PaaS, SaaS), deployment models, major providers (AWS, Azure, Google Cloud), and practical use cases in modern applications.',
            fileUrl: 'https://pub-de18aed5649b4e8a852fdcf7ea3942e4.r2.dev/4292dcc91e94e3397124e00ad58fefeeb28ddd3e39678d095f869d19fad3509f.pdf',
            fileType: 'application/pdf',
            fileSize: 841420,
            category: Category.TECHNOLOGY,
            keywords: ['cloud', 'AWS', 'Azure', 'infrastructure', 'computing'],
            status: MaterialStatus.APPROVED,
            approvedAt: new Date(),
            uploaderId: demoUser.id,
        },
        {
            title: 'FrontEnd Programming (HTML, CSS and JAVASCRIPT)',
            description: 'Complete beginner-friendly tutorial covering the core technologies of web development. Includes hands-on examples, best practices, and modern development workflows.',
            fileUrl: 'https://pub-de18aed5649b4e8a852fdcf7ea3942e4.r2.dev/fbf02e07fdc8f5c44e8c6f3c2df936e9e72c187d0efcd7bfff88060ce6eecbdb.pdf',
            fileType: 'application/pdf',
            fileSize: 2902740,
            category: Category.TECHNOLOGY,
            keywords: ['web development', 'HTML', 'CSS', 'JavaScript', 'frontend'],
            status: MaterialStatus.APPROVED,
            approvedAt: new Date(),
            uploaderId: demoUser.id,
        },
        {
            title: 'Cybersecurity Essentials',
            description: 'Introduction to cybersecurity principles including encryption, network security, common threats, and best practices for protecting digital assets.',
            fileUrl: 'https://pub-de18aed5649b4e8a852fdcf7ea3942e4.r2.dev/d5ad8c6fef084fe837a35dfccccd6ade7b6f9d9fb6dc0b3cb17ca4c2f261e2e3.pdf',
            fileType: 'application/pdf',
            fileSize: 5953270,
            category: Category.TECHNOLOGY,
            keywords: ['security', 'encryption', 'hacking', 'network', 'protection'],
            status: MaterialStatus.APPROVED,
            approvedAt: new Date(),
            uploaderId: demoUser.id,
        },
        {
            title: 'Database Design and SQL',
            description: 'Learn database fundamentals including normalization, ER diagrams, SQL queries, and database optimization techniques for efficient data management.',
            fileUrl: 'https://pub-de18aed5649b4e8a852fdcf7ea3942e4.r2.dev/f165b1b462c1ccf49820ef7f46eb2601ef6b17dac5bf007c0d996b6e20e8acce.pdf',
            fileType: 'application/pdf',
            fileSize: 11211566,
            category: Category.TECHNOLOGY,
            keywords: ['database', 'SQL', 'normalization', 'queries', 'data'],
            status: MaterialStatus.APPROVED,
            approvedAt: new Date(),
            uploaderId: demoUser.id,
        },

        // ENGINEERING Materials
        {
            title: 'Mechanical Engineering: Statics and Dynamics',
            description: 'Fundamental principles of statics and dynamics covering force systems, equilibrium, friction, kinematics, and kinetics with engineering applications.',
            fileUrl: 'https://pub-de18aed5649b4e8a852fdcf7ea3942e4.r2.dev/fc416b8e4e11a43248586c0eadac47c3e6d0382168053a87208d380167b9d53e.pdf',
            fileType: 'application/pdf',
            fileSize: 79313,
            category: Category.ENGINEERING,
            keywords: ['mechanical', 'statics', 'dynamics', 'force', 'equilibrium'],
            status: MaterialStatus.APPROVED,
            approvedAt: new Date(),
            uploaderId: demoUser.id,
        },
        {
            title: '5 Electrical Circuits',
            description: 'Basic electrical circuit theory including Ohm\'s Law, Kirchhoff\'s laws, series and parallel circuits, and practical circuit analysis techniques.',
            fileUrl: 'https://pub-de18aed5649b4e8a852fdcf7ea3942e4.r2.dev/d0f80159162861d8691c7326111336d36297dde3b74d5a878aa3f6c29ca86587.pdf',
            fileType: 'application/pdf',
            fileSize: 6961617,
            category: Category.ENGINEERING,
            keywords: ['electrical', 'circuits', 'voltage', 'current', 'resistance'],
            status: MaterialStatus.APPROVED,
            approvedAt: new Date(),
            uploaderId: demoUser.id,
        },
        {
            title: 'Sustainable Engineering Practices',
            description: 'Exploration of green engineering principles, renewable energy systems, sustainable materials, and environmental impact assessment in modern engineering.',
            fileUrl: 'https://pub-de18aed5649b4e8a852fdcf7ea3942e4.r2.dev/d681ddee76fc61bf5ecd8a19ddaad3a504d080d64ab13758b409b4c1c4f0e9cd.pdf',
            fileType: 'application/pdf',
            fileSize: 1068753,
            category: Category.ENGINEERING,
            keywords: ['sustainability', 'renewable energy', 'environment', 'green engineering'],
            status: MaterialStatus.APPROVED,
            approvedAt: new Date(),
            uploaderId: demoUser.id,
        },
        {
            title: 'Industrial Robotics and Automation',
            description: 'Introduction to robotics covering kinematics, sensors, actuators, control systems, and programming for autonomous systems.',
            fileUrl: 'https://pub-de18aed5649b4e8a852fdcf7ea3942e4.r2.dev/d112a8e6a233fcce80a23758d769d5f20d70a4bc69fc1f463e5827ee7f1028d4.pdf',
            fileType: 'application/pdf',
            fileSize: 930618,
            category: Category.ENGINEERING,
            keywords: ['robotics', 'automation', 'sensors', 'control systems', 'AI'],
            status: MaterialStatus.APPROVED,
            approvedAt: new Date(),
            uploaderId: demoUser.id,
        },

        // ARTS Materials
        {
            title: 'Renaissance Art and Architecture',
            description: 'Journey through major art movements from the Renaissance through Modernism, featuring key artists, masterpieces, and cultural contexts.',
            fileUrl: 'https://pub-de18aed5649b4e8a852fdcf7ea3942e4.r2.dev/173007444436938937c9d44a04eaa95dd8630d7cca2bb61e0e89c4288b89a5af.webp',
            fileType: 'image/webp',
            fileSize: 142520,
            category: Category.ARTS,
            keywords: ['art history', 'renaissance', 'painting', 'sculpture', 'modernism'],
            status: MaterialStatus.APPROVED,
            approvedAt: new Date(),
            uploaderId: demoUser.id,
        },
        {
            title: 'Elements and Principles of Art and Design',
            description: 'Modern guide to digital art creation covering color theory, composition, typography, and tools like Adobe Creative Suite and Figma.',
            fileUrl: 'https://pub-de18aed5649b4e8a852fdcf7ea3942e4.r2.dev/76b33e9da4d8223113739c0ab13c686f6bcd91f4bffac1fce80c785383f833a4.pdf',
            fileType: 'application/pdf',
            fileSize: 2418787,
            category: Category.ARTS,
            keywords: ['digital art', 'design', 'adobe', 'typography', 'composition'],
            status: MaterialStatus.APPROVED,
            approvedAt: new Date(),
            uploaderId: demoUser.id,
        },
        {
            title: 'Music Theory Cheat Poster',
            description: 'Complete introduction to music theory including notation, scales, chords, harmony, and rhythm patterns with practical exercises.',
            fileUrl: 'https://pub-de18aed5649b4e8a852fdcf7ea3942e4.r2.dev/d7ffb3d7b4b3e88b40ab5f3352f8a2c1d4cb7bf3cc7e87c4d1d2bef0ba17e8f1.png',
            fileType: 'image/png',
            fileSize: 1093628,
            category: Category.ARTS,
            keywords: ['music', 'theory', 'notation', 'harmony', 'scales'],
            status: MaterialStatus.APPROVED,
            approvedAt: new Date(),
            uploaderId: demoUser.id,
        },
        {
            title: 'Creative Writing Techniques',
            description: 'Comprehensive guide to creative writing covering narrative structure, character development, dialogue, and various literary styles.',
            fileUrl: 'https://pub-de18aed5649b4e8a852fdcf7ea3942e4.r2.dev/b597a06643f439b03c518469a2ff4b26e140a5755111fa500c9839746e91ee08.pdf',
            fileType: 'application/pdf',
            fileSize: 1196503,
            category: Category.ARTS,
            keywords: ['writing', 'creative', 'narrative', 'literature', 'storytelling'],
            status: MaterialStatus.APPROVED,
            approvedAt: new Date(),
            uploaderId: demoUser.id,
        },

        // MATHEMATICS Materials
        {
            title: 'Calculus I: Limits and Derivatives',
            description: 'Introduction to differential calculus covering limits, continuity, derivatives, and applications including optimization and related rates.',
            fileUrl: 'https://pub-de18aed5649b4e8a852fdcf7ea3942e4.r2.dev/742cccd94326a10ffe5563d528f7f5b6059b45e0ba4ff6551570b6cb641872c6.pdf',
            fileType: 'application/pdf',
            fileSize: 2020894,
            category: Category.MATHEMATICS,
            keywords: ['calculus', 'derivatives', 'limits', 'optimization', 'mathematics'],
            status: MaterialStatus.APPROVED,
            approvedAt: new Date(),
            uploaderId: demoUser.id,
        },
        {
            title: 'Linear Algebra and Matrix Theory',
            description: 'Comprehensive coverage of vector spaces, linear transformations, eigenvalues, eigenvectors, and applications in computer graphics and data science.',
            fileUrl: 'https://pub-de18aed5649b4e8a852fdcf7ea3942e4.r2.dev/de8ad2604626b0ba9eb62cb317fdeb3e18fda43d4094dbb9b9b6e0ba46b6f7f8.pdf',
            fileType: 'application/pdf',
            fileSize: 205269,
            category: Category.MATHEMATICS,
            keywords: ['linear algebra', 'matrices', 'vectors', 'eigenvalues', 'transformations'],
            status: MaterialStatus.APPROVED,
            approvedAt: new Date(),
            uploaderId: demoUser.id,
        },
        {
            title: 'Statistics and Probability',
            description: 'Essential statistics and probability concepts including distributions, hypothesis testing, regression analysis, and real-world applications.',
            fileUrl: 'https://pub-de18aed5649b4e8a852fdcf7ea3942e4.r2.dev/8d87027fc0dcb82b512a1eb4bb4b40a6b7058b4912f03e84f829f628bfe71fa8.pdf',
            fileType: 'application/pdf',
            fileSize: 939459,
            category: Category.MATHEMATICS,
            keywords: ['statistics', 'probability', 'distributions', 'hypothesis testing', 'data analysis'],
            status: MaterialStatus.APPROVED,
            approvedAt: new Date(),
            uploaderId: demoUser.id,
        },
        {
            title: 'Discrete Mathematics for Computer Science',
            description: 'Mathematical foundations for computing including logic, set theory, graph theory, algorithms, and computational complexity.',
            fileUrl: 'https://pub-de18aed5649b4e8a852fdcf7ea3942e4.r2.dev/48edb1991deb37cf97d5a08404ac4f1fcb46b563b830a2d2879ed05b08189399.pdf',
            fileType: 'application/pdf',
            fileSize: 342524,
            category: Category.MATHEMATICS,
            keywords: ['discrete math', 'logic', 'graphs', 'algorithms', 'computer science'],
            status: MaterialStatus.APPROVED,
            approvedAt: new Date(),
            uploaderId: demoUser.id,
        },
    ];

    console.log('Creating materials...');

    await prisma.material.createMany({
        data: materials,
    });

    console.log(`${materials.length} materials created.`);
    console.log('\n🎉 Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error during seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });