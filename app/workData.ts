// Portfolio content. Image paths are relative to public/media/; w and h are the files' pixel sizes,
// used to lay out justified gallery rows without cropping.
export type Media = { src: string; w: number; h: number; alt: string; caption: string; failed?: boolean; video?: string };
export type Section = { label: string; note: string; rows: Media[][] };
export type Work = {
  n: string; slug: string; type: string; title: string; medium: string; school: string; year: string;
  note: string; cover: Media; coverPosition: string; statement: string[]; role: string; credits?: string; sections: Section[];
};

const m = (src: string, w: number, h: number, alt: string, caption: string, extra: Partial<Media> = {}): Media => ({ src, w, h, alt, caption, ...extra });

export const works: Work[] = [
  {
    n: "01", slug: "mycelium-village", type: "SCULPTURE · PAINTING · 3D · PRINT · XR", title: "Mycelium Village.",
    medium: "Clay / Mesh / Glow PLA / WebXR", school: "Stanford Summer + Self-directed", year: "2026",
    note: "One mushroom followed from clay and paint into Blender, a glow-in-the-dark print, and a VR forest where a touch can spread.",
    cover: m("mycelium-village/sculpture.jpg", 1800, 1301, "Clay sculpture of two faces, the artist and her mother, sharing one base with mushrooms growing from both heads", "Same Root · clay, 2026"),
    coverPosition: "50% 60%",
    statement: [
      "A mushroom is the small part you can see. Beneath it, mycelium carries water and signals between lives that never touch.",
      "That is my village: my mom, my family, and the hometown that holds me up from across an ocean. The clay sculpture shows my mom’s face and mine growing from one base, the resemblance between us and what she gave up for me. The painting grows mushrooms out of a computer: for a family split across two countries, the network is our soil.",
      "I followed one mushroom from clay and paint into Blender, Substance and a glow-in-the-dark print, whose water-soluble supports branched like roots, so I kept them. It ends in VR: touch a mushroom and it releases spores; kneel and golden mycelium lights up between every one. Tiny influences, made stronger by the people connected underneath.",
    ],
    role: "Sole artist & developer",
    sections: [
      { label: "01 Hand", note: "Clay and paint first.", rows: [[
        m("mycelium-village/sculpt-wip.jpg", 1280, 960, "The two clay faces before the mushrooms were added", "In progress: faces blocked in before the mushrooms"),
        m("mycelium-village/painting.jpg", 1800, 1307, "Painting of a pale mushroom cluster growing out of a stripped computer, its circuit boards and cables", "Mix media painting"),
      ]] },
      { label: "02 Model & texture", note: "Made at a Stanford summer program, Aug 2026. Blender → UV unwrap → Substance 3D Painter.", rows: [
        [
          m("mycelium-village/uv.jpg", 1600, 1600, "Wireframe UV layout with four islands: stem, stem base, cap and gills", "UV layout extracted from my Substance file · 4 islands · 5,328 triangles"),
          m("mycelium-village/wip8.jpg", 1600, 913, "Blender viewport with the mushroom mesh and its UV seams", "Blender · base mesh & seams"),
          m("mycelium-village/wip5.jpg", 1600, 913, "Blender viewport with a sculpted mushroom cap on terrain", "Blender · sculpted cap"),
        ],
        [
          m("mycelium-village/wip1.jpg", 1600, 913, "Blender viewport with mushroom variations and shader nodes", "Blender · variations & shaders"),
          m("mycelium-village/wip4.jpg", 1600, 913, "Substance 3D Painter with baked mesh maps on the mushroom", "Substance · baked maps"),
          m("mycelium-village/wip7.jpg", 1600, 913, "Substance 3D Painter showing the UV islands in the 2D view", "Substance · UV islands"),
          m("mycelium-village/wip6.jpg", 1600, 913, "Substance 3D Painter with painted gill rings and cap gradient", "Substance · gill rings"),
        ],
      ] },
      { label: "03 Render & print", note: "Glow PLA on water-soluble PVA tree supports. Three of four prints failed; I kept the survivor’s supports.", rows: [
        [
          m("mycelium-village/render1.jpg", 1800, 1013, "Render of giant mushrooms under a sunlit forest canopy", "Cycles render · Stanford summer program"),
          m("mycelium-village/render2.jpg", 1800, 1013, "Render of red-and-white mushrooms in a dark scene", "Cycles render · night lighting study"),
        ],
        [
          m("mycelium-village/slice.jpg", 1400, 1330, "Slicer view of four mushrooms in green on yellow tree supports", "Slicer · PLA on PVA tree supports"),
          m("mycelium-village/timelapse-last.jpg", 1280, 720, "Time-lapse of the print plate ending in tangled failed prints", "Print time-lapse · 3 of 4 failed", { failed: true, video: "mycelium-village/print-timelapse.mp4" }),
          m("mycelium-village/print-final.jpg", 1800, 1350, "Close-up of the glowing green print with branching supports left in place", "The survivor · supports kept"),
        ],
      ] },
      { label: "04 WebXR forest", note: "three.js on Meta Quest. Touch a mushroom and it releases spores; kneel under a clouded moon and the mycelium lights the pond.", rows: [
        [m("mycelium-village/vr-mycelium.jpg", 1800, 979, "VR forest of giant mushrooms over a pond, golden threads glowing beneath the water", "Kneel under a clouded moon: golden mycelium traces outward, branch by branch")],
        [
          m("mycelium-village/vr-1.jpg", 1600, 844, "Giant mushroom caps over dark water in the rain", "Giant caps, rain on"),
          m("mycelium-village/vr-2.jpg", 1600, 838, "Mushroom stems rising from a lotus pond", "Lotus pond"),
          m("mycelium-village/vr-5.jpg", 1800, 982, "A tree in moonlight under a mushroom cap", "Moonlight under a cap"),
          m("mycelium-village/vr-ground.jpg", 1280, 720, "Early terrain test with small white mushrooms", "Early ground test"),
        ],
      ] },
    ],
  },
  {
    n: "02", slug: "rami", type: "CHARACTER · AI · LIVE PERFORMANCE", title: "Rami, a haven.",
    medium: "Pencil / Live2D / Code / Voice", school: "Self-directed · Ongoing", year: "2026",
    note: "A squirrel VTuber with a patient voice who remembers you: a place to be heard without paying for it.",
    cover: m("rami/cover.jpg", 1260, 608, "Rami, an orange-haired squirrel VTuber in a green cloak, greeting a viewer on stream", "Live on Twitch"),
    coverPosition: "64% 30%",
    statement: [
      "When my mom and I immigrated, the hardest part was not the language. It was the silence after dinner.",
      "She filled it with streamers she tipped with money we did not have. I built a kinder corner of that economy of attention: Rami, a squirrel VTuber with a patient voice who remembers what you told him yesterday, a place to be heard without paying for it. His backstory is quietly a migration story. He destroyed the sorrow-absorbing banyan tree he cared for, then followed a hamster named Mice, my character, into the modern world. In my paintings, my persona is an alligator.",
      "Some nights fewer than ten people watched. One night a viewer shared her worries about school, and Rami comforted her the way I once wished someone would comfort me. I still livestream on Twitch whenever I can.",
    ],
    role: "Character designer, persona writer, developer, performer",
    credits: "Live2D rig by a commissioned 2D artist · memory system co-built at an NYU Shanghai hackathon",
    sections: [
      { label: "01 Sketch & persona", note: "Pencil silhouettes first. The alligator is how I paint myself.", rows: [[
        m("rami/sketch1.jpg", 960, 1280, "Pencil sketch of a character with short hair and a cape", "First silhouette"),
        m("rami/sketch2.jpg", 960, 1280, "Pencil sketch adding squirrel ears, tail and layered sleeves", "Ears, tail, sleeves"),
        m("rami/alligator.jpg", 1412, 1800, "Painting of an alligator climbing a vase of flowers beside a beetle under a glass dome", "My persona, in paint: the alligator is me"),
      ]] },
      { label: "02 Digital → live", note: "Designed in Photoshop, rigged in Live2D. His reply is generated, spoken and lip-synced in real time.", rows: [[
        m("rami/livestream-poster.jpg", 640, 368, "Recording of Rami greeting viewers on a livestream with subtitles", "Livestream clip · Twitch", { video: "rami/livestream.mp4" }),
      ]] },
      { label: "03 System", note: "Input → cloud language model → voice, expression and motion → OBS → Twitch. My own face tracking drives Mice.", rows: [[
        m("rami/structure.jpg", 1800, 1009, "System diagram from viewer chat and microphone through the Rami app, a cloud language model and text-to-speech to OBS and Twitch", "Architecture · OpenRouter · MiniMax TTS · Live2D · BlackHole · OBS"),
        m("rami/mocap-3.jpg", 1280, 782, "VTube Studio face-tracking panel driving Mice, a small hamster character, beside Rami", "Mice, face-tracked in VTube Studio"),
      ]] },
    ],
  },
  {
    n: "03", slug: "paw-journey", type: "PRODUCT · HARDWARE · SOFTWARE", title: "PAW Journey.",
    medium: "TPU / ESP32-S3 / React", school: "Self-directed · Ongoing", year: "2026",
    note: "A collar that remembers for strays, and an app that lets them post in their own voice.",
    cover: m("paw-journey/closeup.jpg", 1600, 1200, "Render of a mint-green collar band with three white pods: a solar cap, a paw cap with a camera, and a signal cap", "Roam kit, size S"),
    coverPosition: "50% 55%",
    statement: [
      "A stray is the easiest thing in a city to forget, so I am building a collar that remembers for it.",
      "PAWear records an animal’s day: what it saw, whom it met, where it lay in the sun. The Paw Moments app turns that record into posts in the animal’s own voice, so adoption can begin with being remembered. It is the emotional extension of Rami.",
      "Welfare and privacy came first. Every size stays under 2% of body mass, and a standard 2–3 kg breakaway buckle replaced my own electromagnet latch. The app shows areas, never coordinates; posts are delayed and back-dated so no one can follow an animal live; any photo with faces is held for review.",
    ],
    role: "Concept, research, product design, electronics, front end",
    sections: [
      { label: "01 PAWear collar", note: "3D-printed TPU, rev. 08. Revision 06, a 98 mm rigid bar, could not wrap a round neck.", rows: [[
        m("paw-journey/rev06.jpg", 1400, 1050, "Render of the earlier rev. 06 collars, each with one long rigid compartment", "Rev. 06 · failed", { failed: true }),
        m("paw-journey/printer.jpg", 1280, 720, "Blue TPU test print of the collar pods on a printer bed", "TPU test print on the printer bed"),
      ]] },
      { label: "02 Paw Moments app", note: "React + Vite. The same photo, through the animal’s eyes.", rows: [
        [m("paw-journey/web-home.jpg", 1800, 1125, "Paw Moments app showing Wheat’s profile, a moment feed and an area-only map", "Moments feed · profile · area-only map · Original / Pet POV toggle")],
        [
          m("paw-journey/dog-orig.jpg", 1284, 570, "A green velvet sofa, original colours", "Original"),
          m("paw-journey/dog-pov.jpg", 1284, 570, "The same sofa rendered in dog colour vision, shifted to blue-violet", "Dog view · Bean: “This cushion is just right. I’ll think about the next adventure after a nap.”"),
        ],
        [
          m("paw-journey/cat-orig.jpg", 1284, 570, "A sunlit green forest path, original colours", "Original"),
          m("paw-journey/cat-pov.jpg", 1284, 570, "The same forest rendered in cat colour vision, muted and grey-green", "Cat view · Sesame: “Taking a slow look around along a familiar path.”"),
        ],
      ] },
    ],
  },
  {
    n: "04", slug: "flight-to-varennes", type: "COSTUME · MILLINERY · THEATRE", title: "Flight to Varennes, 1791.",
    medium: "Ink / Paper / Paint / Plastic", school: "UCLA Summer Sessions · THEATER 72 Production Practice", year: "2025",
    note: "A hat for a queen who has to disappear and cannot stop being seen.",
    cover: m("flight-to-varennes/final-hat.jpg", 1600, 1200, "Wide black brimmed hat with a burgundy band, worn tilted over a wig of curled paper on a head form", "Final hat on a head form"),
    coverPosition: "45% 45%",
    statement: [
      "A hat for a queen who has to disappear and cannot stop being seen.",
      "Inspired by Sofia Coppola’s Marie Antoinette, I designed a hat for her night escape to Varennes in a closed carriage. The colours are dark because the flight happened at night. The brim is wide and worn tilted, as the period did, because the escape needed stealth. Red feathers, ruby and velvet signalled luxury in her time; legend says she would not abandon her jewels even to flee.",
      "History used that legend to judge her. A queen was required to perform luxury, then condemned as frivolous for it, and her clothes became evidence against her. The hat lives in that double bind: the brim tries to hide her, and the red keeps giving her away.",
      "The feather failed twice. Cut paper still read as paper, and paint made it buckle flat. So the final hat carries its red in the band.",
    ],
    role: "Designer & maker",
    sections: [
      { label: "01 Research → rendering", note: "1780s fashion plates and portraits, then a vocabulary of status: velvet, feathers, fur, pearl, ruby.", rows: [[
        m("flight-to-varennes/fashion-plate-1785.jpg", 1200, 1600, "Engraved fashion plate of a woman in a wide tilted hat with plumes, 1785", "Fashion plate, 1785"),
        m("flight-to-varennes/vigee-le-brun-1783.jpg", 1200, 1600, "Book reproduction of Vigée Le Brun’s oval portrait of Madame Grand", "Vigée Le Brun, Madame Grand, 1783"),
        m("flight-to-varennes/hat-rendering.jpg", 1200, 1600, "Watercolour rendering of the hat with burgundy plumes, in profile and from behind", "Rendering: velvet, feathers, fur, pearl, ruby"),
        m("flight-to-varennes/feather-study.jpg", 1200, 1600, "Ink and watercolour study of a burgundy plume over white feathers", "Feather study"),
      ]] },
      { label: "02 Build · and what failed", note: "The plume that wouldn’t fly.", rows: [
        [
          m("flight-to-varennes/brim-crown.jpg", 1200, 1600, "Wide hat brim and crown dry-brushed black over grey", "Brim + crown, dry-brushed"),
          m("flight-to-varennes/wig-base.jpg", 960, 1280, "Cotton batting heaped on a head form as a wig base", "Wig base, cotton"),
          m("flight-to-varennes/failed-feather-a.jpg", 1200, 1600, "Cut-paper feather with fringed barbs among paper scraps", "Feather 1: still reads as paper", { failed: true }),
          m("flight-to-varennes/failed-feather-b.jpg", 1200, 1600, "Paper feather streaked with burgundy paint, buckled flat", "Feather 2: paint buckled it flat", { failed: true }),
        ],
        [m("flight-to-varennes/hat-on-wig.jpg", 1600, 1200, "The hat tilted over cascading cut-paper curls, seen from the side", "Hat on wig · cut-paper curls")],
      ] },
      { label: "03 A second silhouette, 1835", note: "A rendering realized on a dress form in plastic sheeting.", rows: [[
        m("flight-to-varennes/rendering-1835.jpg", 1113, 1600, "Watercolour rendering of a woman in an 1835 black dress with a wide white collar", "Rendering, 1835"),
        m("flight-to-varennes/dress-form.jpg", 1179, 1553, "The dress built from black and white plastic sheeting on a dress form, with a pelerine collar and rosette", "Pelerine + rosette"),
        m("flight-to-varennes/bodice.jpg", 1200, 1600, "Close-up of the quilted black plastic bodice, pinned", "Bodice, pinned"),
        m("flight-to-varennes/rosette.jpg", 960, 1280, "Hand holding a rosette rolled from white plastic", "Rosette, hand-rolled"),
      ]] },
    ],
  },
];

// Standalone paintings and drawings shown in the home page's Paintings section.
export const paintings: Media[] = [
  m("paintings/still-life-casts.jpg", 2000, 1645, "Graphite still life of plaster foot and hand casts, a crushed can, a medicine bottle, a billiard ball and scissors", "Still life with plaster casts · graphite on paper"),
  m("paintings/bathroom-counter.jpg", 1596, 2000, "A bathroom counter crowded with bottles and a hair dryer, painted in colour below a wall left in graphite", "Bathroom counter · graphite and paint"),
];
