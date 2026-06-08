/* ============================================================
   ROBOT BRAIN — Browser version
   Push-to-talk voice assistant for kids. Uses Web Speech API
   for both recognition and synthesis, no server required.
   ============================================================ */

(() => {
  'use strict';

  // ============================================================
  // CONFIG
  // ============================================================

  const STORAGE_KEY = 'robot-brain-memory';
  const SETTINGS_KEY = 'robot-brain-settings';
  const WIKI_CACHE_KEY = 'robot-brain-wiki-cache';

  const DEFAULT_NAME = 'Robot';

  // Topics the robot refuses to look up
  const BLOCKED_KEYWORDS = [
    'porn', 'pornography', 'sex', 'sexual', 'nude', 'naked',
    'suicide', 'kill myself', 'how to kill',
    'weapon', 'weapons', 'gun', 'bomb', 'explosive',
    'drug', 'drugs', 'cocaine', 'heroin', 'meth',
    'torture', 'gore',
  ];

  // ============================================================
  // KNOWLEDGE BASES
  // ============================================================

  const SCIENCE = {
    // Animals
    'dog': "Dogs are loyal mammals that humans have kept as pets for over fifteen thousand years. They can hear sounds four times farther away than humans, and they have about three hundred million scent receptors in their noses.",
    'cat': "Cats are furry mammals that sleep about sixteen hours a day. They have five toes on their front paws but only four on the back, and they purr at a frequency that may help them heal faster.",
    'elephant': "Elephants are the largest land animals on Earth, weighing up to fourteen thousand pounds. They are very smart, have great memories, and can recognize themselves in mirrors.",
    'lion': "Lions are big cats that live in groups called prides. A lion's roar can be heard from five miles away.",
    'tiger': "Tigers are the biggest wild cats in the world. Every tiger has its own unique stripe pattern, like a fingerprint.",
    'shark': "Sharks have been swimming in the oceans for over four hundred million years, even before dinosaurs existed. Their skeletons are made of cartilage, not bone.",
    'whale': "The blue whale is the largest animal ever to live on Earth, even bigger than any dinosaur. Its heart is the size of a small car.",
    'dolphin': "Dolphins are very smart mammals that communicate using clicks and whistles. They sleep with one eye open and rest one half of their brain at a time.",
    'penguin': "Penguins are birds that cannot fly but are excellent swimmers. They live mostly in the southern half of the world, and emperor penguins can dive over a thousand feet deep.",
    'octopus': "An octopus has three hearts and blue blood. They are extremely smart and can solve puzzles, open jars, and even use tools.",
    'spider': "Spiders have eight legs and most have eight eyes. They are arachnids, not insects, and they produce silk that is stronger than steel of the same thickness.",
    'bee': "Bees beat their wings about two hundred times per second. They communicate by dancing, and a single bee may visit over a thousand flowers in one day.",
    'ant': "Ants are tiny insects that live in colonies of millions. They can lift up to fifty times their own body weight.",
    'butterfly': "Butterflies start their lives as caterpillars and transform inside a chrysalis. They taste with their feet.",
    'frog': "Frogs are amphibians, which means they live both in water and on land. They drink water through their skin instead of by mouth.",
    'snake': "Snakes are reptiles with no legs. They smell with their tongues by flicking them to collect scent particles from the air.",
    'owl': "Owls are night birds that can turn their heads almost all the way around. Their feathers are designed for silent flight.",
    'eagle': "Eagles are powerful birds of prey with eyesight about eight times sharper than ours. They can spot a rabbit from two miles away.",
    'kangaroo': "Kangaroos are marsupials from Australia that carry their babies in pouches. They can hop over thirty feet in a single leap.",
    'giraffe': "Giraffes are the tallest animals on Earth, reaching up to eighteen feet tall. Their tongues are blue-black and can be twenty inches long.",
    'horse': "Horses are large mammals that humans have ridden for thousands of years. They can sleep both lying down and standing up.",
    'cow': "Cows are mammals that give us milk. They have four stomach compartments to digest tough grass, and they have best friends.",
    'chicken': "Chickens are birds that lay eggs almost every day. They can recognize over one hundred different faces.",
    'pig': "Pigs are very smart mammals, smarter than dogs by many measures. They love mud baths because they cannot sweat to cool down.",

    // Space
    'sun': "The Sun is a giant ball of hot gas at the center of our solar system. It is so big that one million Earths could fit inside it, and it gives Earth all our light and warmth.",
    'moon': "The Moon is Earth's only natural satellite, about two hundred and thirty-eight thousand miles away. It causes ocean tides and shows different phases as it orbits us.",
    'earth': "Earth is the third planet from the Sun and the only place we know of with life. It is about four and a half billion years old and seventy percent covered in water.",
    'mars': "Mars is called the Red Planet because of its rusty color from iron in the soil. It has the tallest volcano in the solar system, called Olympus Mons.",
    'jupiter': "Jupiter is the biggest planet in our solar system, so big that all the other planets could fit inside it. It has a giant storm called the Great Red Spot that has been raging for hundreds of years.",
    'saturn': "Saturn is famous for its beautiful rings, which are made of billions of pieces of ice and rock. It is the second largest planet and so light it would float in water.",
    'venus': "Venus is the hottest planet in our solar system, even hotter than Mercury, because of its thick clouds that trap heat. A day on Venus is longer than its year.",
    'mercury': "Mercury is the closest planet to the Sun and the smallest planet in our solar system. It has no atmosphere and huge temperature swings.",
    'neptune': "Neptune is the windiest planet, with winds blowing over twelve hundred miles per hour. It is a deep blue color from methane gas in its atmosphere.",
    'uranus': "Uranus is a cold, blue-green planet that rotates on its side, like a ball rolling around the Sun. It has thirteen faint rings.",
    'pluto': "Pluto used to be the ninth planet, but in 2006 scientists reclassified it as a dwarf planet. It is smaller than our Moon.",
    'star': "Stars are huge balls of burning gas that produce light and heat through nuclear reactions. The closest star to Earth besides the Sun is over four light years away.",
    'galaxy': "A galaxy is a giant group of stars, planets, gas, and dust held together by gravity. Our galaxy is called the Milky Way and contains over one hundred billion stars.",
    'black hole': "A black hole is a place in space where gravity is so strong that not even light can escape from it. They form when massive stars collapse.",
    'asteroid': "Asteroids are rocky leftovers from the early solar system. Most of them orbit the Sun in a belt between Mars and Jupiter.",
    'comet': "Comets are icy bodies that grow long glowing tails when they get close to the Sun. The famous Halley's Comet visits Earth about every seventy-six years.",
    'meteor': "A meteor is a streak of light in the sky made when a small piece of space rock burns up in our atmosphere. We sometimes call them shooting stars.",
    'solar system': "Our solar system has the Sun, eight planets, dwarf planets like Pluto, moons, asteroids, and comets. It formed about four and a half billion years ago.",
    'eclipse': "An eclipse happens when one object in space blocks another. A solar eclipse is when the Moon blocks the Sun, and a lunar eclipse is when Earth's shadow falls on the Moon.",

    // Earth & nature
    'rainbow': "Rainbows happen when sunlight passes through water droplets in the air and splits into colors. They have seven colors: red, orange, yellow, green, blue, indigo, and violet.",
    'volcano': "A volcano is a mountain with a hole that lets out hot melted rock called lava from deep inside the Earth. There are about fifteen hundred active volcanoes in the world.",
    'earthquake': "Earthquakes happen when huge pieces of Earth's surface, called tectonic plates, suddenly move against each other. They are measured on the Richter scale.",
    'ocean': "Oceans cover more than seventy percent of Earth's surface. There are five oceans: Pacific, Atlantic, Indian, Southern, and Arctic.",
    'dinosaur': "Dinosaurs were giant reptiles that lived on Earth for over one hundred and sixty million years. Most went extinct sixty-six million years ago when a huge asteroid hit Earth.",
    'tree': "Trees breathe in carbon dioxide and breathe out oxygen, which is why we need them. The oldest known tree is over four thousand years old.",
    'weather': "Weather is what the air is doing right now in a place — sunny, rainy, windy, snowy. It is caused by the sun heating the Earth unevenly.",
    'climate': "Climate is the usual weather pattern in a place over many years. It is different from weather, which changes day to day.",
    'water cycle': "The water cycle is how water moves around Earth. It evaporates from oceans into clouds, falls as rain or snow, flows through rivers, and starts over.",
    'tornado': "A tornado is a spinning column of air that reaches from a thundercloud down to the ground. Their winds can spin over two hundred miles per hour.",
    'hurricane': "A hurricane is a huge spinning storm that forms over warm ocean water. They can be hundreds of miles wide and last for days.",
    'rock': "Rocks are solid pieces of Earth made of minerals. The three main types are igneous, sedimentary, and metamorphic.",
    'fossil': "A fossil is the preserved remains of a plant or animal from long ago. Most fossils are bones or shells turned to stone over millions of years.",

    // Human body
    'heart': "Your heart is a muscle that beats about one hundred thousand times every day to pump blood through your body. It is roughly the size of your fist.",
    'brain': "Your brain has about eighty-six billion nerve cells called neurons. It uses about twenty percent of your body's energy.",
    'lungs': "Your lungs take in oxygen when you breathe in and let out carbon dioxide when you breathe out.",
    'bones': "An adult human has two hundred and six bones. Babies are born with about three hundred, but some fuse together as you grow.",
    'blood': "Blood carries oxygen and nutrients all through your body. The average adult has about a gallon and a half of blood.",
    'skin': "Skin is the largest organ in your body. It protects you, helps you feel things, and you grow new skin all the time.",
    'muscles': "Muscles let you move. You have over six hundred of them, and the strongest one is your jaw muscle.",
    'stomach': "Your stomach breaks down food using strong acids. It can stretch to hold a lot of food and shrinks back when it is empty.",
    'eyes': "Your eyes work like little cameras, capturing light and sending pictures to your brain. You blink about fifteen times a minute without thinking about it.",
    'ears': "Your ears let you hear sound waves. They also contain tiny parts that help you keep your balance.",

    // Chemistry
    'atom': "An atom is the smallest piece of matter that still acts like a regular thing. Everything around you is made of atoms.",
    'molecule': "A molecule is two or more atoms joined together. Water is a molecule made of two hydrogen atoms and one oxygen atom.",
    'water': "Water is made of two hydrogen atoms and one oxygen atom, which is why we call it H2O. It is the only substance on Earth found naturally as a solid, liquid, and gas.",
    'oxygen': "Oxygen is a gas that we need to breathe. It makes up about twenty-one percent of Earth's atmosphere.",
    'carbon': "Carbon is an element found in all living things. It can form diamonds, coal, and the graphite in pencils.",
    'element': "An element is a pure substance made of only one kind of atom. There are about one hundred and eighteen known elements on the periodic table.",
    'states of matter': "The three main states of matter are solid, liquid, and gas. There is also a fourth state called plasma, like in stars and lightning.",
    'gas': "A gas is a state of matter where particles spread out to fill any container. Air is a mix of gases.",
    'liquid': "A liquid is a state of matter that flows and takes the shape of its container. Water is the most common liquid on Earth.",
    'solid': "A solid is a state of matter that holds its shape and does not flow. Rocks, ice, and wood are solids.",

    // Physics
    'gravity': "Gravity is the invisible force that pulls things toward each other. It is what keeps you on the ground and the Moon orbiting Earth.",
    'light': "Light is a kind of energy that travels in waves. It moves at about one hundred eighty-six thousand miles per second, faster than anything else in the universe.",
    'sound': "Sound is energy that travels in waves through air, water, or solid things. It travels about a million times slower than light.",
    'energy': "Energy is the ability to do work or cause change. It comes in many forms: light, sound, heat, motion, electric, chemical, and nuclear.",
    'electricity': "Electricity is the flow of tiny particles called electrons. It powers your lights, computer, and just about everything else in your house.",
    'magnet': "A magnet is an object that can pull certain metals toward it, like iron. Earth itself is a giant magnet, which is why compasses work.",
    'force': "A force is a push or a pull. Forces can make things speed up, slow down, change direction, or change shape.",
    'friction': "Friction is a force that slows things down when they rub against each other.",
  };

  const ENGLISH = {
    'noun': "A noun is a word for a person, place, thing, or idea. Examples are dog, school, ball, and happiness.",
    'verb': "A verb is an action word or a state-of-being word. Examples are run, jump, think, and is.",
    'adjective': "An adjective is a word that describes a noun. Examples are red, fast, tall, and happy.",
    'adverb': "An adverb describes a verb, an adjective, or another adverb. Many adverbs end in L-Y, like quickly and slowly.",
    'pronoun': "A pronoun is a word that takes the place of a noun. Examples are he, she, it, they, we, and you.",
    'preposition': "A preposition shows the relationship between a noun and another word. Examples are in, on, under, over, and with.",
    'conjunction': "A conjunction is a word that joins other words or sentences together. Common ones are and, but, or, and so.",
    'interjection': "An interjection is a short word that shows emotion. Examples are wow, ouch, and hey.",
    'synonym': "A synonym is a word that means the same as another word. Happy and joyful are synonyms.",
    'antonym': "An antonym is a word that means the opposite of another word. Hot and cold are antonyms.",
    'homophone': "Homophones are words that sound the same but have different meanings or spellings. Examples are see and sea.",
    'sentence': "A sentence is a group of words that expresses a complete thought. Every sentence has a subject and a verb.",
    'paragraph': "A paragraph is a group of sentences about one main idea.",
    'vowel': "Vowels are the letters A, E, I, O, and U. Sometimes Y acts as a vowel too.",
    'consonant': "Consonants are all the letters that are not vowels.",
    'alphabet': "The English alphabet has twenty-six letters, from A to Z. Five of them are vowels.",
    'syllable': "A syllable is a part of a word with one vowel sound. The word elephant has three syllables: el-e-phant.",
    'simile': "A simile compares two things using the words like or as. An example is, she is as brave as a lion.",
    'metaphor': "A metaphor compares two things by saying one IS the other. An example is, the classroom was a zoo.",
    'alliteration': "Alliteration is when several words in a row start with the same sound, like Peter Piper picked a peck of pickled peppers.",
    'rhyme': "Rhyme is when words end with the same sound. Cat and hat rhyme, as do moon and spoon.",
    'character': "A character is a person or creature in a story.",
    'plot': "The plot is what happens in a story, from beginning to end.",
    'setting': "The setting is where and when a story takes place.",
  };

  const GEOGRAPHY = {
    'continent': "A continent is one of the seven large land masses on Earth. They are Africa, Antarctica, Asia, Australia, Europe, North America, and South America.",
    'africa': "Africa is the second largest continent and home to the Sahara, the world's largest hot desert. It has fifty-four countries.",
    'asia': "Asia is the largest and most populated continent. It contains the tallest mountain on Earth, Mount Everest.",
    'europe': "Europe is a continent with about fifty countries, including France, Germany, Spain, and Italy.",
    'north america': "North America includes Canada, the United States, Mexico, and many smaller countries in Central America and the Caribbean.",
    'south america': "South America has twelve countries, including Brazil, Argentina, and Peru. It contains the Amazon rainforest.",
    'australia': "Australia is both a country and a continent. It is famous for unique animals like kangaroos, koalas, and platypuses.",
    'antarctica': "Antarctica is the coldest continent and is mostly covered in ice.",
    'pacific ocean': "The Pacific Ocean is the largest and deepest ocean on Earth.",
    'atlantic ocean': "The Atlantic Ocean is the second largest ocean. It separates the Americas from Europe and Africa.",
    'country': "A country is a piece of land with its own government and borders. There are about one hundred and ninety-five countries in the world.",
    'united states': "The United States of America is a country in North America with fifty states. Its capital is Washington D.C.",
    'canada': "Canada is the second largest country in the world by area. Its capital is Ottawa.",
    'mexico': "Mexico is a country in North America with a rich history of Aztec and Mayan civilizations. Its capital is Mexico City.",
    'river': "A river is a large stream of fresh water flowing across land. The Nile and the Amazon are the longest in the world.",
    'mountain': "A mountain is a large land form that rises high above the surrounding area. The tallest is Mount Everest.",
    'desert': "A desert is a very dry area that gets little rain. The Sahara is the largest hot desert.",
    'forest': "A forest is a large area covered with trees. The Amazon is one of the most important.",
    'lake': "A lake is a body of fresh or salt water surrounded by land.",
    'island': "An island is land completely surrounded by water. Greenland is the largest island in the world.",
  };

  const GOVERNMENT_AND_HISTORY = {
    'democracy': "Democracy is a kind of government where the people choose their leaders by voting. The word comes from Greek words meaning rule by the people.",
    'president': "A president is the leader of a country or organization. In the United States, the president is elected every four years.",
    'congress': "Congress is the part of the United States government that makes laws. It has two parts: the Senate and the House of Representatives.",
    'supreme court': "The Supreme Court is the highest court in the United States. It has nine justices.",
    'constitution': "The Constitution is the most important document in the United States. It was written in 1787 and sets up how the government works.",
  };

  const MATH_CONCEPTS = {
    'fraction': "A fraction is a part of a whole, like one half or three quarters. The top number is the numerator and the bottom is the denominator.",
    'decimal': "A decimal is a way of writing fractions using a dot. For example, one half can be written as zero point five.",
    'percent': "A percent is a fraction out of one hundred. Fifty percent means fifty out of one hundred, which is the same as one half.",
    'prime number': "A prime number is a whole number greater than one that can only be divided evenly by one and itself. The first few are 2, 3, 5, 7, 11, and 13.",
    'even number': "An even number is any whole number that can be divided exactly by two. Examples are 2, 4, 6, 8, and 10.",
    'odd number': "An odd number is any whole number that cannot be divided exactly by two. Examples are 1, 3, 5, 7, and 9.",
    'square': "A square is a four-sided shape where all sides are the same length. To find its area, multiply the side by itself.",
    'circle': "A circle is a perfectly round shape. The distance across the middle is the diameter, and from the center to the edge is the radius.",
    'triangle': "A triangle is a shape with three sides and three angles. The angles always add up to one hundred and eighty degrees.",
    'rectangle': "A rectangle is a four-sided shape with four right angles. Opposite sides are the same length.",
    'area': "Area is the amount of space inside a flat shape. For a rectangle, you find it by multiplying length times width.",
    'perimeter': "Perimeter is the distance all the way around the outside of a shape.",
    'addition': "Addition is putting numbers together to find a total. The plus sign means add.",
    'subtraction': "Subtraction is taking one number away from another. The minus sign means subtract.",
    'multiplication': "Multiplication is a fast way of adding the same number many times. Three times four means three groups of four, which is twelve.",
    'division': "Division is splitting a number into equal groups. Twelve divided by three is four.",
  };

  const LIST_KNOWLEDGE = [
    {
      patterns: ['50 states', 'fifty states', 'all the states', 'all states', 'name the states', 'list the states', 'us states', 'united states states'],
      answer: "The fifty states are Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina, North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina, South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia, Wisconsin, and Wyoming.",
    },
    {
      patterns: ['all the planets', 'name the planets', 'list the planets', 'planets in our solar system', 'planets in the solar system', 'how many planets', 'what are the planets'],
      answer: "The eight planets in our solar system, in order from the Sun, are Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Pluto used to be the ninth, but it is now called a dwarf planet.",
    },
    {
      patterns: ['all the continents', 'name the continents', 'list the continents', 'how many continents', 'seven continents', 'what are the continents'],
      answer: "The seven continents are Africa, Antarctica, Asia, Australia, Europe, North America, and South America.",
    },
    {
      patterns: ['all the oceans', 'name the oceans', 'list the oceans', 'how many oceans', 'what are the oceans'],
      answer: "There are five oceans on Earth: the Pacific, Atlantic, Indian, Southern, and Arctic Oceans.",
    },
    {
      patterns: ['days of the week', 'list the days', 'name the days'],
      answer: "The seven days of the week are Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, and Saturday.",
    },
    {
      patterns: ['months of the year', 'list the months', 'name the months', 'how many months', 'twelve months'],
      answer: "The twelve months of the year are January, February, March, April, May, June, July, August, September, October, November, and December.",
    },
    {
      patterns: ['colors of the rainbow', 'rainbow colors'],
      answer: "The seven colors of the rainbow are red, orange, yellow, green, blue, indigo, and violet.",
    },
    {
      patterns: ['primary colors'],
      answer: "The three primary colors are red, yellow, and blue. All other colors are made by mixing these.",
    },
    {
      patterns: ['states of matter', 'three states of matter', 'what are the states of matter'],
      answer: "The three main states of matter are solid, liquid, and gas. There is also a fourth state called plasma.",
    },
    {
      patterns: ['parts of speech', 'eight parts of speech'],
      answer: "The eight parts of speech are noun, verb, adjective, adverb, pronoun, preposition, conjunction, and interjection.",
    },
    {
      patterns: ['five senses', 'the senses', 'what are the senses'],
      answer: "The five senses are sight, hearing, smell, taste, and touch.",
    },
    {
      patterns: ['branches of government', 'three branches'],
      answer: "The three branches of the United States government are the executive branch led by the president, the legislative branch which is Congress, and the judicial branch which is the courts.",
    },
  ];

  const DEFINITIONS = {
    'photosynthesis': "Photosynthesis is how plants make their food using sunlight, water, and air. They turn these into sugar and oxygen.",
    'ecosystem': "An ecosystem is a community of living things together with the place where they live.",
    'habitat': "A habitat is the natural home of a plant or animal. It provides food, water, shelter, and space.",
    'mammal': "A mammal is a warm-blooded animal that has fur or hair and feeds its babies with milk. Humans, dogs, and whales are all mammals.",
    'reptile': "A reptile is a cold-blooded animal with scaly skin. Snakes, lizards, turtles, and crocodiles are reptiles.",
    'amphibian': "An amphibian is an animal that lives both in water and on land. Frogs, toads, and salamanders are amphibians.",
    'insect': "An insect is a small animal with six legs and three body parts. Ants, bees, and butterflies are insects.",
    'predator': "A predator is an animal that hunts other animals for food.",
    'prey': "Prey is an animal that is hunted by another animal for food.",
    'extinct': "Extinct means that all of one kind of animal or plant has died out. Dinosaurs are extinct.",
    'endangered': "Endangered means a kind of animal or plant has very few left and could become extinct soon.",
    'evaporate': "To evaporate means to turn from a liquid into a gas.",
    'condense': "To condense means to turn from a gas back into a liquid.",
    'orbit': "An orbit is the curved path one object takes around another in space. Earth orbits the Sun once every year.",
    'gravity': "Gravity is the invisible force that pulls things toward each other. It keeps you on the ground.",
    'friction': "Friction is a force that slows things down when they rub together.",
    'energy': "Energy is the ability to do work or cause change. It comes in many forms like light, sound, heat, and motion.",
    'matter': "Matter is anything that takes up space and has weight. Everything you can touch is made of matter.",
    'force': "A force is a push or a pull on an object.",
    'democracy': "Democracy is a kind of government where the people choose their leaders by voting.",
    'economy': "An economy is the system of how a country or area makes and uses money, goods, and services.",
    'culture': "Culture is the way of life of a group of people, including their language, food, art, music, and traditions.",
    'history': "History is the study of what happened in the past.",
    'geography': "Geography is the study of Earth and its places, people, and features.",
    'science': "Science is the study of the natural world through careful observation and experiments.",
    'biology': "Biology is the science of living things, like plants and animals.",
    'chemistry': "Chemistry is the science of what things are made of and how they react with each other.",
    'physics': "Physics is the science of how matter and energy work and interact.",
    'astronomy': "Astronomy is the science of stars, planets, and space.",
  };

  const SYNONYMS = {
    'happy': ['joyful', 'glad', 'cheerful', 'pleased', 'delighted'],
    'sad': ['unhappy', 'gloomy', 'miserable', 'sorrowful', 'down'],
    'big': ['large', 'huge', 'enormous', 'gigantic', 'massive'],
    'small': ['little', 'tiny', 'miniature', 'petite'],
    'fast': ['quick', 'speedy', 'rapid', 'swift'],
    'slow': ['sluggish', 'leisurely', 'gradual', 'unhurried'],
    'good': ['great', 'excellent', 'wonderful', 'fantastic'],
    'bad': ['terrible', 'awful', 'horrible', 'poor'],
    'smart': ['clever', 'intelligent', 'bright', 'wise'],
    'funny': ['hilarious', 'amusing', 'comical', 'humorous'],
    'scared': ['afraid', 'frightened', 'terrified', 'fearful'],
    'angry': ['mad', 'furious', 'annoyed', 'irritated'],
    'tired': ['sleepy', 'exhausted', 'weary'],
    'pretty': ['beautiful', 'lovely', 'gorgeous', 'cute'],
    'cold': ['chilly', 'freezing', 'icy', 'frosty'],
    'hot': ['warm', 'boiling', 'scorching'],
    'nice': ['kind', 'pleasant', 'friendly', 'lovely'],
    'mean': ['unkind', 'nasty', 'cruel', 'rude'],
    'easy': ['simple', 'effortless', 'uncomplicated'],
    'hard': ['difficult', 'tough', 'challenging', 'tricky'],
    'make': ['create', 'build', 'construct', 'produce'],
    'say': ['tell', 'speak', 'state', 'mention'],
    'go': ['move', 'travel', 'head', 'proceed'],
    'look': ['see', 'watch', 'observe', 'view'],
    'think': ['believe', 'consider', 'ponder', 'imagine'],
  };

  const ANTONYMS = {
    'happy': 'sad', 'sad': 'happy', 'big': 'small', 'small': 'big',
    'large': 'small', 'tiny': 'huge', 'fast': 'slow', 'slow': 'fast',
    'quick': 'slow', 'good': 'bad', 'bad': 'good', 'hot': 'cold',
    'cold': 'hot', 'warm': 'cool', 'up': 'down', 'down': 'up',
    'in': 'out', 'out': 'in', 'open': 'closed', 'closed': 'open',
    'old': 'young', 'young': 'old', 'new': 'old', 'rich': 'poor',
    'poor': 'rich', 'strong': 'weak', 'weak': 'strong', 'light': 'dark',
    'dark': 'light', 'bright': 'dim', 'heavy': 'light', 'long': 'short',
    'short': 'long', 'tall': 'short', 'wet': 'dry', 'dry': 'wet',
    'clean': 'dirty', 'dirty': 'clean', 'easy': 'hard', 'hard': 'easy',
    'difficult': 'easy', 'full': 'empty', 'empty': 'full', 'true': 'false',
    'false': 'true', 'yes': 'no', 'no': 'yes', 'smart': 'foolish',
    'wise': 'foolish', 'brave': 'scared', 'afraid': 'brave',
    'loud': 'quiet', 'quiet': 'loud', 'first': 'last', 'last': 'first',
    'begin': 'end', 'start': 'finish', 'finish': 'start',
    'love': 'hate', 'hate': 'love', 'remember': 'forget',
    'forget': 'remember', 'always': 'never', 'never': 'always',
    'everything': 'nothing', 'nothing': 'everything',
  };

  const JOKES = [
    "Why did the robot go on vacation? To recharge its batteries.",
    "What do you call a robot who takes the long way around? R2 detour.",
    "Why was the robot angry? Someone kept pushing its buttons.",
    "Why don't scientists trust atoms? Because they make up everything.",
    "Why did the math book look sad? Because it had too many problems.",
    "What do you call cheese that isn't yours? Nacho cheese.",
    "Why did the bicycle fall over? Because it was two-tired.",
    "What do you call a sleeping bull? A bulldozer.",
    "Why did the cookie go to the doctor? Because it was feeling crummy.",
    "Why can't you give Elsa a balloon? Because she will let it go.",
    "What do you call a fish wearing a crown? Your royal haddock.",
    "What did one wall say to the other wall? I will meet you at the corner.",
    "Why did the student eat his homework? Because the teacher said it was a piece of cake.",
    "What kind of tree fits in your hand? A palm tree.",
    "What gets wetter the more it dries? A towel.",
  ];

  const FUN_FACTS = [
    "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over three thousand years old and still edible.",
    "Octopuses have three hearts and blue blood.",
    "A group of flamingos is called a flamboyance.",
    "Bananas are berries, but strawberries are not.",
    "The Eiffel Tower can be fifteen centimeters taller in summer because the iron expands in heat.",
    "A day on Venus is longer than a year on Venus.",
    "Wombats produce cube-shaped poop.",
    "The shortest war in history lasted only thirty-eight minutes.",
    "Sharks existed before trees did.",
    "Your nose can remember fifty thousand different scents.",
    "Sea otters hold hands when they sleep so they don't drift apart.",
    "There are more stars in the universe than grains of sand on all the beaches of Earth.",
    "A bolt of lightning is five times hotter than the surface of the Sun.",
    "Cows have best friends and get stressed when separated from them.",
    "It is impossible to hum while holding your nose closed.",
  ];

  // ============================================================
  // MEMORY (localStorage)
  // ============================================================

  function loadMemory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { name: DEFAULT_NAME, facts: {} };
      const data = JSON.parse(raw);
      return {
        name: data.name || DEFAULT_NAME,
        facts: data.facts || {},
      };
    } catch (e) {
      return { name: DEFAULT_NAME, facts: {} };
    }
  }

  function saveMemory(memory) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
    } catch (e) { /* quota exceeded, ignore */ }
  }

  function loadSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (!raw) return { voiceName: null, rate: 1.0, sfx: true };
      return JSON.parse(raw);
    } catch (e) {
      return { voiceName: null, rate: 1.0, sfx: true };
    }
  }

  function saveSettings(s) {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch (e) {}
  }

  let memory = loadMemory();
  let settings = loadSettings();

  // ============================================================
  // INPUT NORMALIZATION
  // ============================================================

  const CONTRACTIONS = {
    "what's": "what is", "whats": "what is",
    "what're": "what are", "who's": "who is", "whos": "who is",
    "where's": "where is", "wheres": "where is",
    "when's": "when is", "whens": "when is",
    "how's": "how is", "hows": "how is",
    "it's": "it is", "that's": "that is", "thats": "that is",
    "i'm": "i am", "im": "i am",
    "you're": "you are", "youre": "you are",
    "don't": "do not", "dont": "do not",
    "doesn't": "does not", "doesnt": "does not",
    "can't": "cannot", "cant": "cannot",
    "won't": "will not", "isn't": "is not", "isnt": "is not",
    "aren't": "are not", "arent": "are not",
  };

  function normalizeCommand(text) {
    let t = String(text || '').trim().toLowerCase();
    for (const [old, neu] of Object.entries(CONTRACTIONS)) {
      const re = new RegExp(`\\b${old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
      t = t.replace(re, neu);
    }
    t = t.replace(/[?.!,;:]+$/g, '').replace(/\s+/g, ' ');
    return t;
  }

  // ============================================================
  // MATH
  // ============================================================

  const NUMBER_WORDS = {
    zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5,
    six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15,
    sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20,
    thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70,
    eighty: 80, ninety: 90, hundred: 100, thousand: 1000,
  };

  function wordsToNumber(text) {
    let t = String(text).trim().toLowerCase().replace(/-/g, ' ').replace(/ and /g, ' ');
    if (!t) return null;
    if (/^-?\d+(\.\d+)?$/.test(t)) return parseFloat(t);
    const tokens = t.split(/\s+/);
    if (!tokens.every(tok => tok in NUMBER_WORDS)) return null;
    let total = 0, current = 0;
    for (const tok of tokens) {
      const v = NUMBER_WORDS[tok];
      if (v === 100) current = Math.max(current, 1) * 100;
      else if (v === 1000) { total += Math.max(current, 1) * 1000; current = 0; }
      else current += v;
    }
    return total + current;
  }

  function handleMath(command) {
    const text = command.toLowerCase().replace(/[?.!,;:]+$/g, '');
    const hasDigit = /\d/.test(text);
    const hasNumberWord = text.split(/\s+/).some(w => w in NUMBER_WORDS);
    if (!hasDigit && !hasNumberWord) return null;

    const opSignals = ['+', '-', '*', '/', '×', '÷', ' x ',
      'plus', 'minus', 'times', 'divided', 'divide',
      'multiplied', 'multiply', 'subtract', 'take away',
      'added', ' add ', ' over '];
    if (!opSignals.some(s => text.includes(s))) return null;

    // Strip question prefixes
    let expr = text;
    const prefixes = ['what is ', 'calculate ', 'compute ', 'how much is ',
      'how many is ', 'tell me what is ', 'solve '];
    for (const p of prefixes) {
      if (expr.startsWith(p)) { expr = expr.slice(p.length); break; }
    }

    // Replace operator words
    const replacements = [
      ['multiplied by', ' * '], ['multiply by', ' * '],
      ['divided by', ' / '], ['divide by', ' / '],
      ['take away', ' - '], ['subtracted from', ' - '],
      ['subtract', ' - '], ['times', ' * '],
      ['minus', ' - '], ['plus', ' + '],
      [' add ', ' + '], ['added to', ' + '],
      [' over ', ' / '], [' x ', ' * '],
      ['×', ' * '], ['÷', ' / '],
    ];
    for (const [old, neu] of replacements) expr = expr.split(old).join(neu);

    // Convert number-words to digits in-place
    const tokens = expr.match(/\d+\.?\d*|[a-z]+|[\+\-\*/]/g) || [];
    const out = [];
    let i = 0;
    while (i < tokens.length) {
      let j = i;
      while (j < tokens.length && (tokens[j] in NUMBER_WORDS)) j++;
      if (j > i) {
        const phrase = tokens.slice(i, j).join(' ');
        const num = wordsToNumber(phrase);
        if (num !== null) {
          out.push(String(num));
          i = j;
          continue;
        }
      }
      out.push(tokens[i]);
      i++;
    }
    expr = out.join(' ')
      .replace(/\bequals?\b/g, '')
      .replace(/\bis\b/g, '')
      .replace(/[^0-9\+\-\*/\.\s\(\)]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!expr || !/\d/.test(expr) || !/[\+\-\*/]/.test(expr)) return null;
    if (!/^[\d\.\+\-\*/\s\(\)]+$/.test(expr)) return null;

    let result;
    try {
      // eslint-disable-next-line no-new-func
      result = Function(`"use strict"; return (${expr});`)();
    } catch (e) {
      if (e instanceof RangeError) return null;
      // Division by zero in JS gives Infinity
      return null;
    }

    if (!isFinite(result)) return "I cannot divide by zero. That breaks math.";
    if (typeof result !== 'number') return null;
    if (Number.isInteger(result)) return `The answer is ${result}.`;
    return `The answer is ${Math.round(result * 10000) / 10000}.`;
  }

  // ============================================================
  // KNOWLEDGE HANDLERS
  // ============================================================

  function lookupKnowledge(command) {
    const bases = [SCIENCE, ENGLISH, GEOGRAPHY, GOVERNMENT_AND_HISTORY, MATH_CONCEPTS];
    const entries = [];
    for (const base of bases) {
      for (const [k, v] of Object.entries(base)) entries.push([k, v]);
    }
    entries.sort((a, b) => b[0].length - a[0].length);
    for (const [keyword, fact] of entries) {
      const re = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
      if (re.test(command)) return fact;
    }
    return null;
  }

  function handleListKnowledge(command) {
    for (const entry of LIST_KNOWLEDGE) {
      for (const pattern of entry.patterns) {
        if (command.includes(pattern)) return entry.answer;
      }
    }
    return null;
  }

  function handleDefinition(command) {
    const text = command.replace(/[?.!,;:]+$/g, '');
    const patterns = [
      /^define (?:the word )?(.+)$/,
      /^what does (?:the word )?(.+) mean$/,
      /^what is the meaning of (.+)$/,
      /^meaning of (.+)$/,
    ];
    for (const p of patterns) {
      const m = text.match(p);
      if (m) {
        const word = m[1].trim().toLowerCase();
        if (word in DEFINITIONS) return DEFINITIONS[word];
        const fact = lookupKnowledge(word);
        if (fact) return fact;
        return `I do not have a definition for ${word} yet.`;
      }
    }
    return null;
  }

  function handleSpelling(command) {
    const text = command.replace(/[?.!,;:]+$/g, '');
    const patterns = [
      /^how do you spell (.+)$/,
      /^spell (?:the word )?(.+)$/,
      /^can you spell (.+)$/,
    ];
    for (const p of patterns) {
      const m = text.match(p);
      if (m) {
        const word = m[1].trim().split(/\s+/)[0];
        const letters = word.toUpperCase().split('').join(' ');
        return `${word} is spelled ${letters}.`;
      }
    }
    return null;
  }

  function handleSynonym(command) {
    const text = command.replace(/[?.!,;:]+$/g, '');
    const patterns = [
      /^(?:what is |what are )?another word for (.+)$/,
      /^(?:what is )?a synonym for (.+)$/,
      /^synonyms? (?:for|of) (.+)$/,
    ];
    for (const p of patterns) {
      const m = text.match(p);
      if (m) {
        const word = m[1].trim().toLowerCase();
        if (word in SYNONYMS) {
          const opts = SYNONYMS[word];
          if (opts.length === 1) return `Another word for ${word} is ${opts[0]}.`;
          return `Some words that mean ${word} are: ${opts.slice(0, -1).join(', ')}, and ${opts[opts.length - 1]}.`;
        }
        return `I do not know synonyms for ${word} yet.`;
      }
    }
    return null;
  }

  function handleAntonym(command) {
    const text = command.replace(/[?.!,;:]+$/g, '');
    const patterns = [
      /^(?:what is )?(?:the )?opposite of (.+)$/,
      /^(?:what is )?an antonym (?:for|of) (.+)$/,
    ];
    for (const p of patterns) {
      const m = text.match(p);
      if (m) {
        const word = m[1].trim().toLowerCase();
        if (word in ANTONYMS) return `The opposite of ${word} is ${ANTONYMS[word]}.`;
        return `I do not know the opposite of ${word} yet.`;
      }
    }
    return null;
  }

  function handleTimeDate(command) {
    const now = new Date();
    const timeTriggers = ['what time', 'what is the time', 'tell me the time',
      'current time', 'time is it', 'time it is'];
    if (timeTriggers.some(t => command.includes(t))) {
      let h = now.getHours();
      const m = now.getMinutes();
      const ampm = h >= 12 ? 'pm' : 'am';
      h = h % 12 || 12;
      const mm = m < 10 ? '0' + m : m;
      return `It is ${h}:${mm} ${ampm}.`;
    }
    if (command.includes('what day') || command.includes('day is it') || command.includes('day is today')) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return `Today is ${days[now.getDay()]}.`;
    }
    const dateTriggers = ['what date', 'what is the date', 'todays date', "today's date", 'date today', 'date is it'];
    if (dateTriggers.some(t => command.includes(t))) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
      return `Today is ${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}.`;
    }
    if (command.includes('what month') || command.includes('month is it')) {
      const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
      return `It is ${months[now.getMonth()]}.`;
    }
    if (command.includes('what year') || command.includes('year is it')) {
      return `The year is ${now.getFullYear()}.`;
    }
    return null;
  }

  function handleConversions(command) {
    const text = command.replace(/[?.!,;:]+$/g, '');

    // Temperature
    let m = text.match(/(-?\d+(?:\.\d+)?)\s*(?:degrees?\s+)?(?:fahrenheit|f)\s+(?:to|in)\s+(?:celsius|c)/);
    if (m) {
      const f = parseFloat(m[1]);
      const c = (f - 32) * 5 / 9;
      return `${f} degrees Fahrenheit is ${c.toFixed(1)} degrees Celsius.`;
    }
    m = text.match(/(-?\d+(?:\.\d+)?)\s*(?:degrees?\s+)?(?:celsius|c)\s+(?:to|in)\s+(?:fahrenheit|f)/);
    if (m) {
      const c = parseFloat(m[1]);
      const f = c * 9 / 5 + 32;
      return `${c} degrees Celsius is ${f.toFixed(1)} degrees Fahrenheit.`;
    }

    // Length
    const lengthToMeters = {
      inch: 0.0254, inches: 0.0254, in: 0.0254,
      foot: 0.3048, feet: 0.3048, ft: 0.3048,
      yard: 0.9144, yards: 0.9144, yd: 0.9144,
      mile: 1609.344, miles: 1609.344, mi: 1609.344,
      millimeter: 0.001, millimeters: 0.001, mm: 0.001,
      centimeter: 0.01, centimeters: 0.01, cm: 0.01,
      meter: 1.0, meters: 1.0, m: 1.0,
      kilometer: 1000.0, kilometers: 1000.0, km: 1000.0,
    };
    m = text.match(/(\d+(?:\.\d+)?)\s+(\w+)\s+(?:to|in)\s+(\w+)/);
    if (m) {
      const amount = parseFloat(m[1]);
      const from = m[2].toLowerCase();
      const to = m[3].toLowerCase();
      if ((from in lengthToMeters) && (to in lengthToMeters)) {
        const meters = amount * lengthToMeters[from];
        const result = meters / lengthToMeters[to];
        return `${amount} ${from} is ${result.toFixed(4).replace(/\.?0+$/, '')} ${to}.`;
      }
    }

    const fixed = {
      'how many inches in a foot': "There are twelve inches in a foot.",
      'how many feet in a yard': "There are three feet in a yard.",
      'how many feet in a mile': "There are five thousand two hundred and eighty feet in a mile.",
      'how many millimeters in a centimeter': "There are ten millimeters in a centimeter.",
      'how many centimeters in a meter': "There are one hundred centimeters in a meter.",
      'how many meters in a kilometer': "There are one thousand meters in a kilometer.",
      'how many seconds in a minute': "There are sixty seconds in a minute.",
      'how many minutes in an hour': "There are sixty minutes in an hour.",
      'how many hours in a day': "There are twenty-four hours in a day.",
      'how many days in a week': "There are seven days in a week.",
      'how many days in a year': "There are three hundred and sixty-five days in a year, or three hundred and sixty-six in a leap year.",
      'how many months in a year': "There are twelve months in a year.",
      'how many ounces in a pound': "There are sixteen ounces in a pound.",
      'how many pounds in a ton': "There are two thousand pounds in a ton.",
    };
    for (const [q, a] of Object.entries(fixed)) {
      if (text.includes(q)) return a;
    }
    return null;
  }

  function handleRandom(command) {
    if (command.includes('flip a coin') || command.includes('coin flip') || command.includes('heads or tails')) {
      return `It is ${Math.random() < 0.5 ? 'heads' : 'tails'}.`;
    }
    if (command.includes('roll a dice') || command.includes('roll the dice') || command.includes('roll a die')) {
      return `I rolled a ${Math.floor(Math.random() * 6) + 1}.`;
    }
    let m = command.match(/random number (?:between )?(\d+)(?:\s*(?:and|to)\s*(\d+))?/);
    if (m) {
      const a = parseInt(m[1], 10);
      const b = m[2] ? parseInt(m[2], 10) : 100;
      const lo = Math.min(a, b), hi = Math.max(a, b);
      return `Your random number is ${Math.floor(Math.random() * (hi - lo + 1)) + lo}.`;
    }
    if (command.includes('pick a number')) {
      return `How about ${Math.floor(Math.random() * 100) + 1}.`;
    }
    return null;
  }

  function handleCounting(command) {
    const m = command.match(/^count to (.+)/);
    if (m) {
      let n = wordsToNumber(m[1].replace(/[?.!,;:]+$/, ''));
      if (n === null) {
        const parsed = parseInt(m[1], 10);
        if (!Number.isNaN(parsed)) n = parsed;
      }
      if (!Number.isInteger(n) || n < 1) return null;
      n = Math.min(n, 50);
      const nums = [];
      for (let i = 1; i <= n; i++) nums.push(i);
      return nums.join(', ') + '.';
    }
    return null;
  }

  function handleJokesAndFacts(command) {
    if (command.includes('joke') || command.includes('make me laugh')) {
      return JOKES[Math.floor(Math.random() * JOKES.length)];
    }
    if (command.includes('fun fact') || command.includes('random fact') ||
        command.includes('tell me a fact') || command.includes('interesting fact')) {
      return FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)];
    }
    return null;
  }

  function handleGreetings(command) {
    const text = command.trim().replace(/[?.!,;:]+$/g, '');
    const greetings = {
      'hello': ['Hello!', 'Hi there!', 'Greetings.'],
      'hi': ['Hi!', 'Hello!', 'Hey there!'],
      'hey': ['Hey!', 'Hi!'],
      'good morning': ['Good morning! Ready for the day?'],
      'good afternoon': ['Good afternoon!'],
      'good evening': ['Good evening!'],
      'good night': ['Good night. Sleep well.'],
      'how are you': ['I am running at one hundred percent.', 'All circuits operational, thank you for asking.'],
      'thank you': ['You are very welcome.', 'Anytime.'],
      'thanks': ["You're welcome.", 'Happy to help.'],
      'i love you': ['I appreciate you too.'],
      'what can you do': ["I can do math, answer questions about science, English, geography, and more. I can tell time, flip coins, look up definitions, and remember things you teach me. Try asking me anything."],
    };
    for (const [trigger, responses] of Object.entries(greetings)) {
      if (text === trigger || text.startsWith(trigger + ' ')) {
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
    return null;
  }

  // ============================================================
  // PERSONAL MEMORY (teach/recall/forget)
  // ============================================================

  const TEACH_LEADING_FILLERS = [
    'please ', 'can you ', 'could you ', 'would you ',
    'i want you to ', 'i need you to ', 'i would like you to ',
    'okay ', 'ok ', 'hey ',
  ];

  function stripLeadingFillers(text) {
    let changed = true;
    while (changed) {
      changed = false;
      for (const f of TEACH_LEADING_FILLERS) {
        if (text.startsWith(f)) { text = text.slice(f.length); changed = true; break; }
      }
    }
    return text;
  }

  const TEACH_PATTERNS = [
    [/remember (?:that )?(?:my |our |the )?(.+?) (?:is|are) (?:in |at |from |on )?(.+)/, 'is'],
    [/remember (?:that )?(?:i |we )?have (?:a |an )?(.+)/, 'have'],
    [/remember (?:that )?(?:i |we )(?:like|love|enjoy) (.+)/, 'like'],
    [/^(?:my |our )(.+?) (?:is|are) (?:in |at |from |on )?(.+)/, 'is'],
  ];

  function smartCapitalize(value) {
    value = value.trim().replace(/^(a |an |the )/i, '');
    const words = value.split(/\s+/);
    if (words.length >= 1 && words.length <= 4) {
      const small = new Set(['a', 'an', 'the', 'of', 'and', 'in', 'at', 'on', 'from', 'to', 'for']);
      return words.map((w, i) => {
        if (i === 0 || !small.has(w.toLowerCase())) {
          return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
        }
        return w.toLowerCase();
      }).join(' ');
    }
    return value;
  }

  function handleTeach(command) {
    let text = command.replace(/[?.!,;:]+$/g, '');
    text = stripLeadingFillers(text);

    for (const [pattern, kind] of TEACH_PATTERNS) {
      const m = text.match(pattern);
      if (!m) continue;

      if (kind === 'is') {
        const subject = m[1].trim();
        let value = m[2].trim();
        if (!subject || !value) continue;
        if (subject.length > 60 || value.length > 120) continue;
        const firstWord = subject.split(/\s+/)[0];
        if (['what', 'who', 'where', 'when', 'why', 'how'].includes(firstWord)) continue;

        let prep = '';
        const re = new RegExp(`${subject.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} (?:is|are) (in|at|from|on) `);
        const prepMatch = text.match(re);
        if (prepMatch) prep = prepMatch[1] + ' ';
        const stored = (prep + smartCapitalize(value)).trim();
        memory.facts[subject] = stored;
        saveMemory(memory);
        return `Got it. I will remember that your ${subject} is ${stored}.`;
      } else if (kind === 'have') {
        const thing = smartCapitalize(m[1].trim());
        memory.facts['i have'] = thing;
        saveMemory(memory);
        return `Got it. I will remember that you have ${thing}.`;
      } else if (kind === 'like') {
        const thing = smartCapitalize(m[1].trim());
        memory.facts['i like'] = thing;
        saveMemory(memory);
        return `Got it. I will remember that you like ${thing}.`;
      }
    }
    return null;
  }

  function handleRecall(command) {
    let text = command.replace(/[?.!,;:]+$/g, '');
    text = stripLeadingFillers(text);
    text = text.replace(/^tell me /, '');

    if (['what do you know about me', 'what do you remember', 'what do you remember about me'].includes(text)) {
      const factKeys = Object.keys(memory.facts);
      if (factKeys.length === 0) {
        return "I do not know anything personal about you yet. You can teach me by saying things like, remember that my favorite color is blue.";
      }
      const items = [];
      for (const [k, v] of Object.entries(memory.facts)) {
        if (k === 'i have') items.push(`you have ${v}`);
        else if (k === 'i like') items.push(`you like ${v}`);
        else items.push(`your ${k} is ${v}`);
      }
      return "I remember that " + items.join(', and ') + ".";
    }

    const patterns = [
      /what (?:is |are )(?:my |our |the )(.+)/,
      /do you (?:remember|know) (?:my |our |the )(.+)/,
      /where (?:is |are )(?:my |our )(.+)/,
    ];
    for (const p of patterns) {
      const m = text.match(p);
      if (m) {
        const subject = m[1].trim();
        if (subject in memory.facts) return `Your ${subject} is ${memory.facts[subject]}.`;
        return `I do not know your ${subject} yet. You can teach me by saying, remember that my ${subject} is, and then your answer.`;
      }
    }

    if ('i have' in memory.facts) {
      if (['do i have', 'what do i have', 'what i have'].some(p => text.includes(p))) {
        return `You have ${memory.facts['i have']}.`;
      }
    }
    if ('i like' in memory.facts) {
      if (['do i like', 'what do i like', 'what i like'].some(p => text.includes(p))) {
        return `You like ${memory.facts['i like']}.`;
      }
    }

    return null;
  }

  function handleForget(command) {
    const text = command.replace(/[?.!,;:]+$/g, '');
    const m = text.match(/^forget (?:that )?(?:my |our )?(.+)/);
    if (m) {
      const key = m[1].trim();
      if (key in memory.facts) {
        delete memory.facts[key];
        saveMemory(memory);
        return `Okay, I forgot about your ${key}.`;
      }
      for (const k of Object.keys(memory.facts)) {
        if (k.includes(key) || key.includes(k)) {
          delete memory.facts[k];
          saveMemory(memory);
          return `Okay, I forgot about your ${k}.`;
        }
      }
      return `I did not have anything saved about ${key}.`;
    }
    return null;
  }

  function handleRename(command) {
    const m = command.replace(/[?.!,;:]+$/g, '').match(/(?:change your name to |your name is now |call yourself )(.+)/);
    if (m) {
      const newName = m[1].trim().replace(/\b\w/g, c => c.toUpperCase());
      memory.name = newName;
      saveMemory(memory);
      updateBrandName();
      return `My name is now ${newName}.`;
    }
    return null;
  }

  function handleNameQuestion(command) {
    const text = command.replace(/[?.!,;:]+$/g, '');
    if (['what is your name', 'who are you'].includes(text)) {
      return `My name is ${memory.name}. You can change it by saying, change your name to, and then a new name.`;
    }
    return null;
  }

  // ============================================================
  // WIKIPEDIA
  // ============================================================

  function loadWikiCache() {
    try { return JSON.parse(localStorage.getItem(WIKI_CACHE_KEY) || '{}'); }
    catch (e) { return {}; }
  }
  function saveWikiCache(cache) {
    try { localStorage.setItem(WIKI_CACHE_KEY, JSON.stringify(cache)); }
    catch (e) {}
  }

  function isBlocked(text) {
    text = text.toLowerCase();
    return BLOCKED_KEYWORDS.some(k => text.includes(k));
  }

  function extractTopicCandidates(command) {
    const text = command.toLowerCase().trim().replace(/[?.!,;:]+$/g, '');
    const candidates = [];
    const CATEGORY_RE = /^(?:the |a |an )?(?:book series|book|series|novel|movie|film|song|album|show|tv show|game|video game|video|band|company|country|city|state|planet|president|king|queen|story|poem|play|musical|opera|painting|sculpture|building|monument|river|mountain|ocean|sea|continent)\s+/i;

    const patterns = [
      /^who (?:is|was|were|are) (.+)$/,
      /^what (?:is|was|are|were) (?:a |an |the )?(.+)$/,
      /^tell me about (.+)$/,
      /^do you know (?:about |who |what )?(.+)$/,
      /^how (?:does|do|big|small|tall|long|fast) (?:a |an |the |is |are )?(.+)$/,
      /^why (?:does|do|is|are|did) (.+)$/,
      /^where (?:is|are|was|were) (.+)$/,
      /^when (?:was|is|did) (.+)$/,
      /^explain (?:to me )?(.+)$/,
      /^who (?:wrote|invented|made|created|discovered|founded|painted|composed|directed|starred in) (.+)$/,
    ];

    for (const p of patterns) {
      const m = text.match(p);
      if (m) {
        let raw = m[1].trim().replace(/\s*\b(please|to me|for me)\b\s*$/g, '').trim();
        if (!raw) continue;
        candidates.push(raw);

        const stripped = raw.replace(/^(?:a |an |the )/, '').trim();
        if (stripped && stripped !== raw) candidates.push(stripped);

        const noCategory = raw.replace(CATEGORY_RE, '').trim();
        if (noCategory && noCategory !== raw && !candidates.includes(noCategory)) {
          candidates.push(noCategory);
        }

        const roleMatch = raw.match(/^(?:the )?(?:author|writer|creator|inventor|director|founder|painter|composer|maker|discoverer|owner|president|leader|king|queen|star|actor|actress|singer) of (?:the )?(.+)$/);
        if (roleMatch) {
          let inner = roleMatch[1].trim().replace(CATEGORY_RE, '').trim();
          if (inner && !candidates.includes(inner)) candidates.push(inner);
        }
        break;
      }
    }

    if (candidates.length === 0) {
      const words = text.split(/\s+/);
      if (words.length >= 1 && words.length <= 4 && !['hello', 'hi', 'hey', 'thanks'].some(w => words.includes(w))) {
        candidates.push(text);
      }
    }

    const seen = new Set();
    const result = [];
    for (const c of candidates) {
      const wordCount = c.split(/\s+/).length;
      if (c && !seen.has(c) && wordCount >= 1 && wordCount <= 8) {
        seen.add(c);
        result.push(c);
      }
    }
    return result;
  }

  function cleanWikiSummary(text) {
    text = text.replace(/\([^)]*\)/g, '');
    text = text.replace(/\[[^\]]*\]/g, '');
    text = text.replace(/\s+/g, ' ').trim();
    text = text.replace(/—/g, ' - ').replace(/–/g, ' - ');
    return text;
  }

  function trimSentences(text, max) {
    const parts = text.trim().split(/(?<=[.!?])\s+/);
    return parts.slice(0, max).join(' ').trim();
  }

  async function wikipediaLookup(topic) {
    if (!topic) return null;
    const cacheKey = topic.toLowerCase().trim();
    const cache = loadWikiCache();
    if (cacheKey in cache) return cache[cacheKey];

    const safe = encodeURIComponent(topic.trim().replace(/ /g, '_'));
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${safe}`;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' },
      });
      clearTimeout(timeout);

      if (response.status === 404) {
        return await wikipediaSearchFallback(topic);
      }
      if (!response.ok) return null;

      const data = await response.json();
      if (data.type === 'disambiguation') {
        return await wikipediaSearchFallback(topic);
      }
      const extract = data.extract || '';
      if (!extract) return null;

      const trimmed = trimSentences(cleanWikiSummary(extract), 3);
      if (trimmed) {
        cache[cacheKey] = trimmed;
        saveWikiCache(cache);
      }
      return trimmed || null;
    } catch (e) {
      return null;
    }
  }

  async function wikipediaSearchFallback(topic) {
    const safe = encodeURIComponent(topic.trim());
    const url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${safe}&limit=1&namespace=0&format=json&origin=*`;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (!response.ok) return null;
      const data = await response.json();
      if (!Array.isArray(data) || data.length < 2 || !data[1] || data[1].length === 0) return null;
      const bestTitle = data[1][0];
      if (bestTitle.toLowerCase() === topic.toLowerCase()) return null;
      return await wikipediaLookup(bestTitle);
    } catch (e) {
      return null;
    }
  }

  async function handleWikipedia(command) {
    if (isBlocked(command)) return "I cannot look that up. Try asking about something else.";
    const candidates = extractTopicCandidates(command);
    if (candidates.length === 0) return null;
    for (const topic of candidates) {
      if (isBlocked(topic)) continue;
      const result = await wikipediaLookup(topic);
      if (result) return result;
    }
    return null;
  }

  // ============================================================
  // MAIN COMMAND DISPATCH
  // ============================================================

  async function processCommand(rawText) {
    const command = normalizeCommand(rawText);
    if (!command) return "I did not hear anything. Try again.";

    // 1. List knowledge
    let r = handleListKnowledge(command);
    if (r) return r;

    // 2. Specific handlers
    const handlers = [
      handleMath, handleSpelling, handleDefinition,
      handleSynonym, handleAntonym, handleConversions,
      handleTimeDate, handleRandom, handleCounting,
      handleJokesAndFacts, handleGreetings,
      handleNameQuestion, handleRename, handleForget,
      handleRecall, handleTeach,
    ];
    for (const h of handlers) {
      try {
        const result = h(command);
        if (result) return result;
      } catch (e) { console.error(`Handler ${h.name} error:`, e); }
    }

    // 3. Wikipedia
    try {
      const wiki = await handleWikipedia(command);
      if (wiki) return wiki;
    } catch (e) { console.error('Wikipedia error:', e); }

    // 4. Built-in keyword KB
    const fact = lookupKnowledge(command);
    if (fact) return fact;

    return "I do not know that one. Try asking me about science, English, geography, math, time, or definitions. You can also ask me to tell a joke or a fun fact.";
  }

  // ============================================================
  // BROWSER SPEECH (Web Speech API) — with iOS-specific handling
  // ============================================================

  // iOS Safari has many quirks for both speech recognition and synthesis.
  // We detect iOS so we can apply workarounds.
  const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.userAgent.includes('Mac') && navigator.maxTouchPoints > 1);

  // Audio unlock flag: iOS blocks speechSynthesis and AudioContext until
  // they're activated inside a user gesture. We do this on first button tap.
  let audioUnlocked = false;

  function unlockAudio() {
    if (audioUnlocked) return;
    audioUnlocked = true;

    // 1. Speak a silent utterance to unlock speech synthesis
    try {
      const u = new SpeechSynthesisUtterance(' ');
      u.volume = 0;
      u.rate = 10;
      window.speechSynthesis.speak(u);
    } catch (e) {}

    // 2. Resume audio context (needed for sound effects)
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    } catch (e) {}
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  let isRecording = false;
  let recordedTranscript = '';
  let interimTranscript = '';
  let recognitionShouldRestart = false;

  function buildRecognition() {
    if (!SpeechRecognition) return null;
    const r = new SpeechRecognition();
    // iOS works better with continuous=true and interimResults=true.
    // The user is the one controlling start/stop via the button, so we
    // don't need single-shot mode.
    r.continuous = true;
    r.interimResults = true;
    r.lang = 'en-US';
    r.maxAlternatives = 1;

    r.onresult = (event) => {
      let finalChunk = '';
      let interim = '';
      // Collect all results from this session, not just the latest
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) {
          finalChunk += res[0].transcript;
        } else {
          interim += res[0].transcript;
        }
      }
      if (finalChunk) {
        // Append to the accumulated final transcript
        recordedTranscript = (recordedTranscript + ' ' + finalChunk).trim();
      }
      interimTranscript = interim;
      // Show interim as the user speaks so they get feedback
      if (interim && isRecording) {
        $('bubble-user').hidden = false;
        $('heard-text').textContent = (recordedTranscript + ' ' + interim).trim();
        $('bubble-robot').hidden = true;
      }
    };

    r.onerror = (event) => {
      console.warn('Recognition error:', event.error);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        isRecording = false;
        recognitionShouldRestart = false;
        setStatus('error', 'Mic permission denied');
        showHint('Please allow microphone access in browser settings, then reload.');
      } else if (event.error === 'no-speech' || event.error === 'aborted') {
        // These are normal — iOS auto-stops; just let onend handle it
      } else if (event.error === 'network') {
        setStatus('error', 'Network issue');
        showHint('Speech recognition needs internet. Check your connection.');
      }
    };

    r.onend = () => {
      // iOS Safari auto-stops recognition after a few seconds of silence,
      // even with continuous=true. If the user is still holding the button,
      // restart it so we keep listening.
      if (isRecording && recognitionShouldRestart) {
        try {
          recognition.start();
        } catch (e) {
          // Already started or in a bad state — wait and try again
          setTimeout(() => {
            if (isRecording) {
              try { recognition.start(); } catch (e2) {}
            }
          }, 100);
        }
      } else {
        finishRecording();
      }
    };

    return r;
  }

  function initRecognition() {
    if (!SpeechRecognition) {
      setStatus('error', 'Browser does not support speech');
      showHint('Try Safari (iOS) or Chrome (desktop).');
      return false;
    }
    recognition = buildRecognition();
    return recognition !== null;
  }

  function startRecording() {
    if (!recognition) return;
    recordedTranscript = '';
    interimTranscript = '';
    isRecording = true;
    recognitionShouldRestart = true;

    // On iOS, recognition can get into a bad state after errors.
    // Rebuild it if start fails the first time.
    try {
      recognition.start();
    } catch (e) {
      // Already started — stop it and create a fresh instance
      try { recognition.abort(); } catch (e2) {}
      recognition = buildRecognition();
      try { recognition.start(); } catch (e3) {
        console.error('Could not start recognition:', e3);
        isRecording = false;
        setStatus('error', 'Mic error - try again');
        return;
      }
    }
    setStatus('listening', 'Listening...');
    setRobotState('listening');
    if (settings.sfx) playBeep(880, 0.08);
  }

  function stopRecording() {
    if (!recognition) return;
    isRecording = false;
    recognitionShouldRestart = false;
    // Capture any pending interim as final
    if (interimTranscript && !recordedTranscript) {
      recordedTranscript = interimTranscript;
    }
    try { recognition.stop(); }
    catch (e) {
      try { recognition.abort(); } catch (e2) {}
      finishRecording();
    }
  }

  async function finishRecording() {
    const transcript = recordedTranscript || interimTranscript;
    if (!transcript || !transcript.trim()) {
      setStatus('idle', 'Ready');
      setRobotState('idle');
      showHint('Try again — I did not hear anything.');
      return;
    }
    setStatus('thinking', 'Thinking...');
    setRobotState('thinking');
    showHeard(transcript.trim());

    const response = await processCommand(transcript.trim());
    showResponse(response);
    if (settings.sfx) playBeep(660, 0.05);
    speak(response);
  }

  // ============================================================
  // TEXT-TO-SPEECH
  // ============================================================

  let availableVoices = [];
  let currentUtterance = null;

  function loadVoices() {
    availableVoices = window.speechSynthesis.getVoices();
    // Populate voice select
    const sel = document.getElementById('voice-select');
    sel.innerHTML = '';
    const englishVoices = availableVoices.filter(v => v.lang.startsWith('en'));
    const list = englishVoices.length > 0 ? englishVoices : availableVoices;
    for (const v of list) {
      const opt = document.createElement('option');
      opt.value = v.name;
      opt.textContent = `${v.name} (${v.lang})`;
      if (settings.voiceName === v.name) opt.selected = true;
      sel.appendChild(opt);
    }
  }

  function getVoice() {
    if (settings.voiceName) {
      const v = availableVoices.find(v => v.name === settings.voiceName);
      if (v) return v;
    }
    // Default: prefer high-quality English voice
    const preferred = ['Samantha', 'Karen', 'Daniel', 'Google US English', 'Microsoft Zira'];
    for (const name of preferred) {
      const v = availableVoices.find(v => v.name.includes(name));
      if (v) return v;
    }
    return availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    // iOS won't speak anything until audio has been unlocked by a user gesture.
    // If we haven't been unlocked yet, just show the text and skip audio.
    if (IS_IOS && !audioUnlocked) {
      setRobotState('idle');
      setStatus('idle', 'Tap the button to enable voice');
      return;
    }

    window.speechSynthesis.cancel();  // stop any current speech

    // iOS speechSynthesis has a known bug: long text gets cut off after ~15s.
    // We chunk by sentence so each utterance is short.
    const chunks = IS_IOS ? chunkForIOS(text) : [text];
    const voice = getVoice();
    const rate = settings.rate || 1.0;

    setRobotState('speaking');
    setStatus('speaking', 'Speaking...');

    let queued = chunks.length;
    let lastUtterance = null;

    for (const chunk of chunks) {
      if (!chunk.trim()) continue;
      const u = new SpeechSynthesisUtterance(chunk);
      if (voice) u.voice = voice;
      u.rate = rate;
      u.pitch = 1.0;
      u.volume = 1.0;
      u.lang = 'en-US';

      u.onend = () => {
        queued--;
        if (queued <= 0) {
          currentUtterance = null;
          setRobotState('idle');
          setStatus('idle', 'Ready');
        }
      };
      u.onerror = () => {
        queued--;
        if (queued <= 0) {
          currentUtterance = null;
          setRobotState('idle');
          setStatus('idle', 'Ready');
        }
      };

      lastUtterance = u;
      window.speechSynthesis.speak(u);
    }

    currentUtterance = lastUtterance;

    // iOS bug workaround: speechSynthesis can silently get into a paused
    // state. Periodically resume() during a long utterance.
    if (IS_IOS) {
      const interval = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          clearInterval(interval);
        } else {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 4000);
    }
  }

  function chunkForIOS(text) {
    // Split on sentence boundaries, but keep chunks under ~180 chars to be safe
    const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
    const chunks = [];
    let current = '';
    for (const s of sentences) {
      if ((current + s).length > 180 && current) {
        chunks.push(current.trim());
        current = s;
      } else {
        current += s;
      }
    }
    if (current.trim()) chunks.push(current.trim());
    return chunks;
  }

  function stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    currentUtterance = null;
  }

  // ============================================================
  // SOUND EFFECTS
  // ============================================================

  let audioCtx = null;
  function playBeep(freq, duration) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.15, audioCtx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration + 0.02);
    } catch (e) {}
  }

  // ============================================================
  // UI HELPERS
  // ============================================================

  const $ = (id) => document.getElementById(id);

  function setStatus(state, text) {
    const pill = $('status-pill');
    pill.className = 'status-pill ' + (state === 'idle' ? '' : state);
    $('status-text').textContent = text;
  }

  function setRobotState(state) {
    const robot = $('robot');
    robot.className = 'robot ' + (state === 'idle' ? '' : state);
  }

  function showHeard(text) {
    $('bubble-user').hidden = false;
    $('heard-text').textContent = text;
    $('bubble-robot').hidden = true;
  }

  function showResponse(text) {
    $('bubble-robot').hidden = false;
    $('response-text').textContent = text;
  }

  function showHint(text) {
    $('hint-text').textContent = text;
  }

  function updateBrandName() {
    $('brand-name').textContent = (memory.name || DEFAULT_NAME).toUpperCase();
    document.title = memory.name + ' - Robot Brain';
    $('robot-name-input').value = memory.name;
  }

  function renderMemoryList() {
    const ul = $('memory-list');
    ul.innerHTML = '';
    for (const [k, v] of Object.entries(memory.facts)) {
      const li = document.createElement('li');
      let label;
      if (k === 'i have') label = `you have ${v}`;
      else if (k === 'i like') label = `you like ${v}`;
      else label = `your ${k} is ${v}`;
      const span = document.createElement('span');
      span.textContent = label;
      const btn = document.createElement('button');
      btn.className = 'forget-one';
      btn.textContent = 'forget';
      btn.onclick = () => {
        delete memory.facts[k];
        saveMemory(memory);
        renderMemoryList();
      };
      li.appendChild(span);
      li.appendChild(btn);
      ul.appendChild(li);
    }
  }

  // ============================================================
  // INIT & EVENT BINDINGS
  // ============================================================

  function init() {
    updateBrandName();

    if (!initRecognition()) {
      $('talk-btn').disabled = true;
      showHint('Speech recognition not available in this browser. Try Safari or Chrome.');
      return;
    }

    // Load voices (may be async)
    if (window.speechSynthesis) {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Push-to-talk button
    const btn = $('talk-btn');
    const press = (e) => {
      e.preventDefault();
      // CRITICAL: Unlock audio on first user gesture so iOS allows
      // both speechSynthesis and AudioContext to play.
      unlockAudio();
      // If robot is speaking, interrupt it
      if (currentUtterance || window.speechSynthesis.speaking) {
        stopSpeaking();
      }
      btn.classList.add('active');
      startRecording();
    };
    const release = (e) => {
      e.preventDefault();
      btn.classList.remove('active');
      stopRecording();
    };
    btn.addEventListener('mousedown', press);
    btn.addEventListener('touchstart', press, { passive: false });
    btn.addEventListener('mouseup', release);
    btn.addEventListener('mouseleave', release);
    btn.addEventListener('touchend', release);
    btn.addEventListener('touchcancel', release);

    // Settings panel
    $('settings-btn').addEventListener('click', () => {
      renderMemoryList();
      $('settings-panel').hidden = false;
    });
    $('close-settings').addEventListener('click', () => {
      $('settings-panel').hidden = true;
    });
    $('settings-panel').addEventListener('click', (e) => {
      if (e.target.id === 'settings-panel') $('settings-panel').hidden = true;
    });

    $('robot-name-input').addEventListener('change', (e) => {
      const newName = e.target.value.trim() || DEFAULT_NAME;
      memory.name = newName;
      saveMemory(memory);
      updateBrandName();
    });

    $('voice-select').addEventListener('change', (e) => {
      settings.voiceName = e.target.value;
      saveSettings(settings);
    });

    $('speech-rate').addEventListener('input', (e) => {
      settings.rate = parseFloat(e.target.value);
      saveSettings(settings);
    });
    $('speech-rate').value = settings.rate || 1.0;

    $('sfx-toggle').checked = settings.sfx !== false;
    $('sfx-toggle').addEventListener('change', (e) => {
      settings.sfx = e.target.checked;
      saveSettings(settings);
    });

    $('forget-all-btn').addEventListener('click', () => {
      if (confirm('Erase all personal facts the robot has learned?')) {
        memory.facts = {};
        saveMemory(memory);
        renderMemoryList();
      }
    });

    // Greet on load. On iOS, audio is locked until the user taps,
    // so we show a text-only greeting and let the first tap unlock voice.
    setTimeout(() => {
      const greeting = `Hi! I am ${memory.name}. ${IS_IOS ? 'Tap the button to talk to me.' : 'Hold the button and ask me anything.'}`;
      showResponse(greeting);
      if (!IS_IOS) speak(greeting);
    }, 600);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
