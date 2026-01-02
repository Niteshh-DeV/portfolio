import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Quote, Heart, X, ChevronDown } from 'lucide-react';

interface PoetryProps {
  onClose: () => void;
}

type Poem = {
  title: string;
  lines: string[];
  date: string;
  pattern: string;
};

export function Poetry({ onClose }: PoetryProps) {
  const [liked, setLiked] = useState<number[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [selectedPoem, setSelectedPoem] = useState<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const poems: Poem[] = [
      {
        title: 'January',
        lines: [
          'Be my January,',
          'Be my first,',
          'First that I think of',
          'While opening eyes',
          'Be my first,',
          'With the Intention of',
          'Keeping our skies,',
          'Breathing our sighs,',
          'Whispering those cries',
          '',
          'Be my January',
          'Be',
          'These cold messy days',
          'With the mists, they stays',
          'Draped afar in dense haze',
          'Eyes met—what a quite praise',
          'A dremscape brings magical gaze',
          '',
          'And',
          'Be my December,',
          'To keep the lament chime',
          'To Hold, like a cascading wane',
          'Not to lose, not to hide',
          'Ashen days, a blurry sight',
          '',
          'Be my December',
          'Be My last,',
          'A luminous Light being wise',
          'Frostine meet and time flies',
          'Be my last,',
          'Last that I think of',
          'While probably closing',
          'Eyes',
          '🤍'
        ],
        date: '1st Jan 2026',
        pattern: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(59, 130, 246, 0.05) 35px, rgba(59, 130, 246, 0.05) 70px)'
      },
      {
        title: 'The last breath',
        lines: [
          'The last breath that I will take',
          'Will I inhale the scent of yours',
          'Or Slowly lose the presence of you being',
          'You',
          '',
          'Will I still be able to share eye contact',
          'Or There will be no chance of seeing them',
          'Will I still be able to hold those hands',
          'Just for last time',
          'Or that longing stays eternally with me',
          '',
          'Will I still question you,',
          'why did you do this to me?',
          'Or I am Just thanking you for being on the other side',
          'Am I able to forget you for the last time',
          'Or it keeps hunting me forever',
          '',
          'The last breath that I will take',
          'Will you be there',
          "Or It's just me, worshipping youuu.",
          '🌷🪷'
        ],
        date: '12 Dec 2025',
        pattern: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(59, 130, 246, 0.05) 35px, rgba(59, 130, 246, 0.05) 70px)'
      },
      {
        title: 'Untitled',
        lines: [
          'A formative day full of rain',
          'Grasps of tears in veins',
          'Enlighten a sea of thought',
          'Between what I wished',
          'What I hold and what I got',
          '',
          'The resonance of this silence',
          'And she has my appellation',
          'Buried in the depth of her eyes',
          'And her voice makes the world a new creation',
          '',
          'Waiting forever, for ever for forever',
          'Thou flickers adorn quite as keeper',
          'And All these I Still rustle to her pleasant sight',
          'We’ll consummate us, to depart again Afterlife',
          '',
          'On a starry night a dream brings her',
          'Blurry eyes and the creeper ties me',
          'Thee stroll into keen wits for …',
          'Whisper a phrase with grace',
          'A debt taken from her',
          'Still lilting and blooming, withdraws with a trace.',
          '🩵'
        ],
        date: '18th Sept 2025',
        pattern:
          'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)'
      },
      {
        title: 'Untitled',
        lines: [
          'I wonder how she creates me,',
          'And',
          'The poetry inside me,',
          'Like Breathing and suffocating',
          'All at once,',
          'Its all about her',
          'The way she is',
          'The way Her eyes',
          'Reveals a journey',
          'Quite Sojourns, Timeless and eternal',
          'The way she smiles',
          'Making my world blooming',
          'That we dwell there',
          'Holding Hands',
          'Making memories that never fades',
          'Looking into each other\'s eyes',
          'Feeling lost',
          'And never',
          'Wanted to found',
          'The way She makes me',
          'She makes me to feel who really I am',
          'And what it feels to feel this much',
          'She makes me to write',
          'Sitting here thinking about her',
          'And Feeling Unknown but bright',
          '',
          'There\'s a window in my room, a tree outside',
          'And a bird comes regularly',
          'Chirps sharply',
          'I think he\'s calling for his love',
          'And then I think that',
          'It just come for me',
          'And it just made for me',
          'To see his secret life,',
          'If I also not notice him then who will ?',
          'What\'s his purpose to be there ?',
          'And',
          'I wonder, Does they also rush for the things ?',
          'Like us',
          'Or They have their own world ?',
          'And It reminds me of her',
          'That',
          'I am Still hunting to get her',
          'To get her attention and her devotion',
          '🌙'
        ],
        date: '24 Aug 2025',
        pattern: 'radial-gradient(circle at 35% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 65% 40%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)'
      },
      {
        title: 'Untitled',
        lines: [
          'Waiting for a miracle',
          'That I can see with Closed eyes',
          'And When I Open them',
          'She appears',
          'She appears Smiling',
          'A face little shy',
          'Tying her hair',
          'A little bindi and the glow up',
          'The sight of love and care',
          'So how can I unsee that',
          'The Beauty of Her',
          'And',
          'Her mesmerizing glance at me',
          'She keeps Touching the skies',
          'And I always keep Falling for her',
          'Bit by bit',
          '',
          'That thread of hope',
          'Tied to us',
          'Is it visible to only me ?',
          'Or She also Sees',
          'When her eyes finds me',
          'Idk what she feels ?',
          '',
          'But What if we make it',
          'When the arms will wrap',
          'And we find our ways to each other',
          'So',
          'The sky and the land meet once,',
          'And at the end',
          'All These dreams comes true',
          'All this gone, what we suffered through',
          '',
          "Nowadays her pictures don't work",
          'I need her',
          'I need her presence even in this silence',
          'And I wanna tell her that',
          'I love her the most',
          '💜'
        ],
        date: '23rd July 2025',
        pattern: 'radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 50%), radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)'
      },
      {
        title: 'Untitled',
        lines: [
          'Lemme suffer a little long',
          'You know,',
          'Suffering is a curse',
          'And the curse of being happy for her',
          'And the curse of being sad for me',
          'Its never ends',
          'An endless loop',
          'Only a way to exit',
          'Her gaze',
          '',
          "My nerves only know the sense of her's",
          'A warmth I found But never touched',
          'And the veins in my hand crafts her name',
          'Each line I wrote feels like she came',
          'Still the brain cells forgets',
          'And feedbacks of her memory remains same',
          '',
          'She,',
          'The atonement for my character glows',
          'A dream I remembered even after rouse.'
        ],
        date: '21st June 2025',
        pattern: 'repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(59, 130, 246, 0.06) 60px, rgba(236, 72, 153, 0.06) 120px)'
      },
      {
        title: 'A Whisper',
        lines: [
          'A quite whisper I left',
          'She probably knows ,',
          'And she echoes in my universe',
          'Under an velvet sky',
          'There’s only us',
          'Roaming around aimlessly',
          'In a world we traversed.',
          '',
          'I am just written by her',
          'Every line she wrote was perfect',
          'Except one she writes for us',
          'And thats why',
          'Now I am writing her',
          'With these scars and lights',
          'And all these visuals and sights',
          'She is just perfect in her ways',
          'A solace for my rainy nights .',
          '',
          'Its time to read our old talks',
          'The dream we have and those walks',
          'She never says a word',
          'Still she conveys all of herself to me',
          'In a way no-one even noticed',
          '',
          'It just a delusion, She says',
          'A delusion',
          'Or',
          'A world that',
          'I am hiding from every consciousness',
          'I am still here and forever will be',
          'Waiting for her and being little aware',
          'Eyes closed, tranquil and serene',
          'Yes a whisper I left',
          'But does she really care ?',
          '',
          '_Usko janni he meri har khabar',
          'Aur',
          'Usko meri khabar tak nahi …',
          '❤️'
        ],
        date: '13th June 2025',
        pattern:
          'radial-gradient(circle at 25% 60%, rgba(236, 72, 153, 0.12) 0%, transparent 50%), radial-gradient(circle at 75% 30%, rgba(59, 130, 246, 0.12) 0%, transparent 50%)'
      },
        {
          title: 'Untitled',
          lines: [
            'She lives within me',
            'Always',
            "I don't have to remind her",
            'She is always here With me in every essence',
            'And now',
            'All I remembered is just her',
            'Each and every bit',
            'Also',
            'Her presence and her absence',
            '',
            'I lack patience',
            'Still I could wait a lifetime just for her',
            "Even though if she doesn't look me back",
            'Thats why, I call it for Forever',
            'And a little thread of distance',
            'She is giving all of her to me',
            'Her love, her devotion and these spring seasons',
            'Also the dusk of silence',
            'Filled with a little hope',
            '',
            'In everything I have and',
            'In everything I do',
            'A part of her is present',
            'Guiding me through these cliffs',
            'And through these mountain ledge',
            'Sometimes I realize',
            'Its all my fault and those flaws I did',
            'But she is the one n only I ever need',
            '',
            'The Bindi she wears',
            'A dot keeps my eyes stitched',
            "I can't get off my eyes from her",
            'I stare, stare and just stare',
            'I found her in this dramatic world',
            'With a faith, everyone frighten to dare',
            '',
            'I am willing to give her all of me',
            'And I am here to love her forever',
            'But for her.. does forever exists?',
            'I know she also wants',
            'She keeps things in',
            'But I can see',
            'In her shadows the truth quietly persists.',
            '❤️'
          ],
          date: '21 May 2025',
          pattern:
            'radial-gradient(circle at 30% 30%, rgba(16, 185, 129, 0.1) 0%, transparent 45%), radial-gradient(circle at 75% 70%, rgba(59, 130, 246, 0.08) 0%, transparent 45%)'
        },
      {
        title: 'Untitled',
        lines: [
          'Its been a month',
          'We haven\'t talked',
          'I see her each day',
          'Stare her each moment',
          'Wishing she would turn back',
          'For me',
          '',
          'The audacity to talk to her',
          'But the trio',
          'Her eyes , Her Smile and Her rosy Face',
          'I want but I can\'t these giving the mess',
          'And the addiction to stare her',
          'Sitting behind',
          'How time passes and the grace',
          '',
          'The empathy to read her eyes',
          'Fall once and getting lost',
          'And her those unrevealed wishes',
          'The amour between us whispers when I am awake',
          '',
          'Her gaze filled with longing',
          'And I adore her with a faith',
          'The charm she holds and how prettier she is',
          'And Me laying down underneath',
          '',
          'In the vastness of space',
          'The secrets of universe trapped',
          'Just like the desires of her',
          'Influents in between us and gets draped',
          '❤️'
        ],
        date: '1st May 2025',
        pattern: 'radial-gradient(circle at 40% 35%, rgba(236, 72, 153, 0.1) 0%, transparent 50%), radial-gradient(circle at 65% 65%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)'
      },
      {
        title: 'Untitled',
        lines: [
          'She writes, She whispers, She dreams',
          'And she lives the moments without any screams',
          'But',
          'She hides, she cries and she has fears',
          'And I like her cause the way she cares',
          'And that\'s so I am ..',
          '',
          'I miss her a little more',
          'When the loneliness hunts me in the crowd',
          'When I can\'t resist the tears in between the thought',
          'When she appears in dreams and stays',
          'Yes I miss her a little more',
          'This long long ways .',
          '',
          'Staring at Her, like she is mine',
          'And thinking… is she mine ?',
          'The ways she shines like the pure divine',
          'She is the poems i write and also the their rhyme',
          '',
          'Owhh The sudden ache',
          'When I see her and when i miss her',
          'Gives the relief like ethereal',
          'That longs in the elegant manner',
          'And the sudden ache',
          'When not seeing her the way we used to be',
          'But I love her, and she has that glamour',
          '',
          'That day, when she draped 💜',
          'Appearing that way',
          'My heart got trapped',
          'How can someone be that much angelic',
          'The smile, the longing and the rosy look',
          'She has the light',
          'To keep me always on the hook.',
          '❤️'
        ],
        date: '24th April 2025',
        pattern: 'radial-gradient(circle at 30% 40%, rgba(244, 63, 94, 0.12) 0%, transparent 45%), radial-gradient(circle at 70% 75%, rgba(59, 130, 246, 0.1) 0%, transparent 45%)'
      },
      {
        title: 'Untitled',
        lines: [
          'Its raining heavy,',
          'And thoughts of her are penetrating',
          'Like the lightning pierce the clouds,',
          'Like the storm blows to the leaves,',
          'And like echos of strings sing in the ears .',
          '',
          'And Just like her ,',
          'I love the sound of thunder',
          'I love the flash of lightning',
          'I love the rain',
          'Cause they teach me that',
          'It’s not always okay to be calm',
          'That sometimes I learn to be loud',
          'Its better to being little rude also',
          'Like she is with me .',
          '',
          'Look how we pour ourselves to them',
          'For those who can’t even be the same',
          'I know her like nobody else and',
          'Also how she came',
          'She is beautiful just more than this rain',
          'And hope she knows how much chaos needs to bear and to sustain .',
          '',
        ],
        date: '9 April 2025',
        pattern:
          'radial-gradient(circle at 30% 35%, rgba(59, 130, 246, 0.12) 0%, transparent 45%), radial-gradient(circle at 70% 75%, rgba(99, 102, 241, 0.12) 0%, transparent 45%)'
      },
      {
        title: 'Untitled',
        lines: [
          'So I am here again',
          'Laying down On the roof',
          'Watching moon',
          'And thinking about the MOON🌙',
          'The moon is lonely',
          'As i am',
          'And the MOON is full of STARTS',
          'Who doesn\'t even care a bit about me .',
          '',
          'The perfect women',
          'She is in front of me',
          'Yet to get her',
          'I have to live another lifetime',
          'Yet completely out of reach',
          'Like the Moon .',
          '',
          'Ik she is ignoring me',
          'Just like the moon ignores the tides',
          'Just like the Space ignores light',
          'Just like the sun ignores auroras',
          'And Just like the goddess ignores flora',
          'Simply and beautifully',
          '',
          'So for what ?',
          'This absence',
          'This ignorance',
          'This hate',
          'Ig',
          'Its because I love her',
          'And I love to love her',
          'And Now',
          'I love the ignorance',
          'I love the absence',
          'Cause its given by her',
          'Somehow it reminds me of her',
          'It connects me with her.',
          '',
          'Hope someday she will come',
          'Give the titles to these Poem',
          'Hope someday she’ll come 🫴',
          'Completely fills the inner void',
          'Hope someday she’ll come',
          'Erase the insecurities that i crave',
          'Hope someday she’ll come',
          'Just to give flowers to my grave .',
          'Hope soo .....'
        ],
        date: '7th April 2025',
        pattern:
          'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.12) 0%, transparent 45%), radial-gradient(circle at 75% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 45%)'
      },
      {
        title: 'Untitled',
        lines: [
          "It's always one sided ,",
          'Why does the moon also look at me ?',
          'Because I gaze at it endlessly ?',
          'There is no point of happening that',
          'The moon is always the same',
          'It changes its phase not the beauty',
          "And it's the best thing that its beauty never changes",
          'like hers the way she came .',
          '',
          'But remember one thing',
          'The one who ignores the most is also',
          'the one who notices the most',
          "It's like seeing her from a far",
          'Wishing she should realises that',
          'Something I wanted to tell her',
          '',
          "Just because she doesn't like that",
          'I am afraid to do that stuff',
          "And it's always her",
          'That brings the smile on my face',
          'And She is more than Enough.',
          '',
          'She always talks through those eyes',
          'Where I am dying to look',
          'Like',
          "It's the magic",
          'That brings her to me',
          'Now I have to understand the whole matter of waves',
          'So I can understand her',
          'So I can tell her over and over again',
          'That She is the bestest.',
          '🤍'
        ],
        date: '14 Feb 2025',
        pattern:
          'radial-gradient(circle at 35% 45%, rgba(255, 255, 255, 0.08) 0%, transparent 45%), radial-gradient(circle at 70% 70%, rgba(59, 130, 246, 0.08) 0%, transparent 45%)'
      },
        {
        title: 'How can I ?',
        lines: [
          "How can I explain 'bout your eyes?",
          'Cause they hold more mystery than the cosmos.',
          'How can I draw your personality?',
          'Cause it is purer than the light.',
          '',
          'How can I compare the moon with you?',
          'Cause it is not as bright as your face.',
          'How can I compare nature with you?',
          'Cause in your arms, I found peace.',
          '',
          'How can I find myself?',
          'Cause I am lost in you.',
          'How can I pretend not to fall?',
          'Cause I am already attached to you.',
          '',
          'Put It In last Cause its My First Poem '
        ],
        date: 'Somewhere in 2024',
        pattern:
          'radial-gradient(circle at 40% 45%, rgba(255, 255, 255, 0.09) 0%, transparent 45%), radial-gradient(circle at 70% 70%, rgba(59, 130, 246, 0.08) 0%, transparent 45%)'
      },
      {
        title: 'Stillness',
        lines: [
          'Idk why I am afraid',
          '',
          'She is there',
          'Still in those Voids in me',
          'And they are',
          'Filled with glimpse of her',
          '',
          'She is there',
          'Still in the secrets',
          'And',
          'In Those secrets',
          'You\'ll only find her',
          '',
          'Yes',
          'She is there',
          'Still In the Remembrance',
          'That I Retain',
          'With teary eyes and hope',
          '',
          'She is there',
          'Still In the locked notes',
          'And hidden dates',
          'That I am never Stop inscribing',
          '',
          'She is there',
          'Still in the quite whispers and secret prayers',
          'I wished in the stillness of her tread',
          '',
          'And she is here',
          'Living within me',
          'Sparkling, Spilling, Stitching lies and Sighing,',
          'In the Softness of Sunset',
          'And Solace of Sorrow',
          'Yess',
          'She is Here and she is there',
          '',
          'Waves of stillness ❤️✨'
        ],
        date: '11 Aug 2024 (11:11 PM)',
        pattern: 'radial-gradient(circle at 25% 40%, rgba(236, 72, 153, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 60%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)'
      }
    ];

  const highlightedPoems = poems.slice(0, 3);
  const morePoems = poems.slice(3);
  const displayedPoems = showAll ? poems : highlightedPoems;

  const toggleLike = (index: number) => {
    setLiked(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const getSnippet = (lines: string[]) => {
    return lines.filter(line => line !== '').slice(0, 3);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="bg-[rgb(var(--background))] w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl border-2 border-[rgb(var(--border))] relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="sticky top-4 right-4 float-right z-10 p-3 bg-[rgb(var(--foreground))] text-[rgb(var(--background))] rounded-full hover:bg-[rgb(var(--secondary))] transition-colors m-4"
          >
            <X size={24} />
          </motion.button>

          <div className="p-8 md:p-12">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-12"
            >
              <h2 className="mb-4 uppercase tracking-wider">Poetry</h2>
              <p className="text-[rgb(var(--muted-foreground))] max-w-2xl mx-auto">
                Where engineering meets expression, where code becomes poetry, and logic dances with emotion.
              </p>
            </motion.div>

            {/* Poems Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedPoems.map((poem, index) => {
                const poemIndex = poems.indexOf(poem);

                return (
                  <motion.div
                    key={`${poem.title}-${poem.date}-${poemIndex}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    onClick={() => setSelectedPoem(poemIndex)}
                    className="glass-effect p-6 rounded-lg relative group border-2 border-[rgb(var(--border))] hover:border-[rgb(var(--foreground))] transition-all cursor-pointer"
                  >
                  <Quote className="absolute top-4 right-4 text-[rgb(var(--foreground))] opacity-10 group-hover:opacity-30 transition-opacity" size={32} />
                  
                  <h4 className="mb-2 uppercase tracking-wider text-sm">{poem.title}</h4>
                  <p className="text-[rgb(var(--muted-foreground))] text-xs mb-4">{poem.date}</p>
                  
                  {/* Snippet Preview */}
                  <div className="space-y-2 mb-4 font-['Raleway',sans-serif] italic">
                    {getSnippet(poem.lines).map((line, lineIndex) => (
                      <p key={lineIndex} className="text-sm leading-relaxed text-[rgb(var(--muted-foreground))]">
                        {line}
                      </p>
                    ))}
                    <p className="text-xs text-[rgb(var(--foreground))] opacity-60 mt-3">
                      Click to read full poem →
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(poemIndex);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Heart
                      size={18}
                      className={`transition-colors ${
                        liked.includes(poemIndex)
                          ? 'fill-[rgb(var(--foreground))] text-[rgb(var(--foreground))]'
                          : 'text-[rgb(var(--muted-foreground))]'
                      }`}
                    />
                    <span className="text-xs text-[rgb(var(--muted-foreground))]">
                      {liked.includes(poemIndex) ? 'Liked' : 'Like'}
                    </span>
                  </motion.button>
                  </motion.div>
                );
              })}
            </div>

            {/* Read More Button */}
            {!showAll && morePoems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12 text-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAll(true)}
                  className="px-8 py-3 bg-[rgb(var(--foreground))] text-[rgb(var(--background))] rounded-lg hover:bg-[rgb(var(--secondary))] transition-all flex items-center gap-2 mx-auto"
                >
                  Read More Poems
                  <ChevronDown size={20} />
                </motion.button>
              </motion.div>
            )}

            {/* Quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-12 text-center"
            >
              <p className="text-[rgb(var(--muted-foreground))] italic mb-4">
                "Poetry is the spontaneous overflow of powerful feelings: it takes its origin from emotion recollected in tranquility."
              </p>
              <p className="text-sm text-[rgb(var(--muted-foreground))]">- William Wordsworth</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Full Poem View */}
        <AnimatePresence>
          {selectedPoem !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 backdrop-blur-md z-[60] flex items-center justify-center p-4"
              onClick={() => setSelectedPoem(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ type: 'spring', damping: 20 }}
                className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Background Pattern */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-40"
                  style={{
                    background: poems[selectedPoem].pattern,
                    backgroundSize: '100px 100px'
                  }}
                />

                {/* Content */}
                <div className="relative bg-[rgb(var(--background))]/90 backdrop-blur-sm rounded-2xl border-2 border-[rgb(var(--border))] p-12 shadow-2xl">
                  {/* Close Button */}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedPoem(null)}
                    className="absolute top-6 right-6 p-2 bg-[rgb(var(--foreground))] text-[rgb(var(--background))] rounded-full hover:bg-[rgb(var(--secondary))] transition-colors"
                  >
                    <X size={20} />
                  </motion.button>

                  {/* Decorative Quote */}
                  <Quote className="absolute top-6 left-6 text-[rgb(var(--foreground))] opacity-10" size={48} />

                  {/* Poem Header */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-12"
                  >
                    <h2 className="mb-2 uppercase tracking-wider">{poems[selectedPoem].title}</h2>
                    <p className="text-[rgb(var(--muted-foreground))] text-sm">{poems[selectedPoem].date}</p>
                  </motion.div>

                  {/* Full Poem */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-3 mb-8 font-['Raleway',sans-serif] max-w-xl mx-auto"
                  >
                    {poems[selectedPoem].lines.map((line, lineIndex) => (
                      <motion.p
                        key={lineIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + lineIndex * 0.1 }}
                        className={line === '' ? 'h-4' : 'text-center italic leading-relaxed'}
                      >
                        {line}
                      </motion.p>
                    ))}
                  </motion.div>

                  {/* Like Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex justify-center"
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleLike(selectedPoem)}
                      className="flex items-center gap-3 px-6 py-3 bg-[rgb(var(--muted))] rounded-full border border-[rgb(var(--border))] hover:bg-[rgb(var(--foreground))] hover:text-[rgb(var(--background))] transition-all"
                    >
                      <Heart
                        size={20}
                        className={`transition-colors ${
                          liked.includes(selectedPoem)
                            ? 'fill-[rgb(var(--foreground))] text-[rgb(var(--foreground))]'
                            : ''
                        }`}
                      />
                      <span className="text-sm">
                        {liked.includes(selectedPoem) ? 'Liked' : 'Like this poem'}
                      </span>
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
