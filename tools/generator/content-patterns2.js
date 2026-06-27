// content-patterns2.js — Track 7: the remaining GoF patterns (modules 46–56).
const attrEsc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const cb = src => '<pre class="code" data-src="'+attrEsc(src)+'"></pre>';
const T7 = 'Track 7: More Design Patterns';
const MODS = {};

// ───────────────────────── 46 Abstract Factory ─────────────────────────
MODS['46'] = {
  num:'46', slug:'abstract-factory', title:'Abstract Factory', navShort:'Abstract Factory', track:T7,
  heroTitle:'A factory for <span class="grad">matching families</span>',
  lede:"Real-world picture: a furniture showroom. Order from the “Victorian” catalogue and the sofa, chair, and table all match. Order “Modern” and you get a different matching set. Abstract Factory creates whole families of related objects that are guaranteed to go together — without naming their concrete classes.",
  conceptH2:'One factory, a coordinated set of products',
  conceptHtml:
    "<p>Factory Method (module 35) makes one product. Abstract Factory makes a <em>family</em>. You define a factory interface with several create-methods, and each concrete factory produces a matching set. Classic use: UI toolkits where every widget must match the OS look.</p>"+
    cb('interface GUIFactory { Button button(); Checkbox checkbox(); }\nclass MacFactory implements GUIFactory {\n    public Button button(){ return new MacButton(); }\n    public Checkbox checkbox(){ return new MacCheckbox(); }   // matches the button\n}\n\nGUIFactory f = onMac ? new MacFactory() : new WinFactory();\nButton b = f.button();        // guaranteed to match f.checkbox()')+
    "<p>Pick the factory once and the whole app produces a consistent family — no risk of a Mac button next to a Windows checkbox. The trade-off: adding a new <em>product</em> means changing every factory. Reach for it when products come in interchangeable, themed sets.</p>",
  stages:[{t:'pick factory',s:'Mac / Win',c:'cyan'},{t:'button()',s:'product 1',c:'amber'},{t:'checkbox()',s:'product 2',c:'purple'},{t:'same family',s:'they match',c:'emerald'},{t:'swap factory',s:'new family',c:'coral'}],
  stepH2:'Build a matching set',
  stepIntro:'Step through how one chosen factory hands you a family of products that are guaranteed to fit together.',
  steps:[
    {n:0, cap:'You need a set of UI widgets that all match one OS theme.'},
    {n:1, cap:'Pick one concrete factory — <b>MacFactory</b> or WinFactory.'},
    {n:2, cap:'Ask it for a button — you get a <b>Mac button</b>.'},
    {n:3, cap:'Ask the <b>same factory</b> for a checkbox — a Mac checkbox.'},
    {n:4, cap:'Every product from one factory belongs to one <b>matching family</b>.'},
    {n:5, cap:'Swap the factory and the <b>whole family</b> changes consistently.'},
  ],
  playH2:'One family, all matching', playFile:'AbstractFactory.java',
  playIntro:'Products from one factory share a style id. Model the “they all match” guarantee.',
  playCode:'// A Modern factory (style 2) makes a matching set\nint sofa  = 2;     // 2 = Modern\nint chair = 2;     // same factory -> same style\nint table = 2;\nSystem.out.println("sofa/chair/table style = " + sofa + "/" + chair + "/" + table);\nSystem.out.println("all match (one family)? " + (sofa == chair));\nSystem.out.println("Switch factory -> a whole new matching set.");',
  callouts:[
    {lang:'python', body:"Often a factory class (or even a module) whose functions return a matching set — duck typing removes the interface ceremony. The “pick one provider, get a consistent family” idea is identical."},
    {lang:'js', body:"A factory object whose methods return matching parts (e.g. a theme object that builds matching components). No <span class='key'>interface</span> keyword, same coordination guarantee."},
    {lang:'csharp', body:"Nearly identical; DI containers frequently act as abstract factories, resolving a coordinated set of services for one configuration."},
  ],
  exercises:[
    {h3:'Factory Method vs Abstract Factory', prompt:"What’s the core difference between Factory Method (35) and Abstract Factory?",
     hint:"Factory Method creates <b>one</b> product via a single overridable method. Abstract Factory creates a <b>family</b> of related products via an object with several create-methods, guaranteeing the products match each other."},
    {h3:'The trade-off', prompt:"Adding a new product type (say a <span class='key'>Slider</span>) to an Abstract Factory is painful. Why?",
     hint:"Every concrete factory must implement the new <span class='key'>slider()</span> method, so you touch them all. Abstract Factory makes adding a new <em>family</em> easy but adding a new <em>product</em> hard — the opposite of what you might expect."},
  ],
};

// ───────────────────────── 47 Prototype ─────────────────────────
MODS['47'] = {
  num:'47', slug:'prototype', title:'Prototype', navShort:'Prototype', track:T7,
  heroTitle:'Create by <span class="grad">copying</span>, not rebuilding',
  lede:"Real-world picture: a “duplicate” button in a design tool. Instead of recreating a shape from scratch — picking the color, size, and effects again — you clone an existing one and tweak it. Prototype creates new objects by copying a fully-configured example.",
  conceptH2:'Clone a configured object',
  conceptHtml:
    "<p>When building an object is expensive (lots of setup, a database read, a heavy computation) or you just want a copy of something already arranged, cloning beats reconstruction. A <strong>prototype</strong> knows how to copy itself, including the tricky bit: <em>deep-copying</em> its mutable parts so the copy is independent.</p>"+
    cb('class Enemy implements Cloneable {\n    int hp; int[] loadout;\n    public Enemy clone() {\n        Enemy c = new Enemy();\n        c.hp = this.hp;\n        c.loadout = this.loadout.clone();   // DEEP copy — not a shared array\n        return c;\n    }\n}\nEnemy boss = configuredPrototype.clone();   // copy, then tweak independently')+
    "<p>The classic gotcha is a <em>shallow</em> copy: if the clone shares the same inner array or list as the original, changing one changes both. Java’s built-in <span class='key'>Cloneable</span> is widely considered clumsy; many teams prefer a copy constructor or a static <span class='key'>copyOf</span> factory instead.</p>",
  stages:[{t:'prototype',s:'configured object',c:'cyan'},{t:'clone()',s:'copy it',c:'purple'},{t:'copy fields',s:'deep copy',c:'amber'},{t:'tweak copy',s:'independent',c:'emerald'},{t:'new object',s:'no rebuild',c:'coral'}],
  stepH2:'Duplicate, then diverge',
  stepIntro:'Step through cloning a prototype and why deep-copying mutable parts keeps the copy independent.',
  steps:[
    {n:0, cap:'Building a fully-configured object from scratch each time is expensive.'},
    {n:1, cap:'Start from an already-configured <b>prototype</b>.'},
    {n:2, cap:'Call <span class="key">clone()</span> to copy it.'},
    {n:3, cap:'Fields are copied — <b>deep-copy</b> mutable ones (arrays, lists) to stay independent.'},
    {n:4, cap:'Tweak the copy without touching the original.'},
    {n:5, cap:'You got a <b>new object</b> without re-running costly construction.'},
  ],
  playH2:'An independent copy', playFile:'Prototype.java',
  playIntro:'A clone copies the prototype’s values. Model the identical-but-separate copy.',
  playCode:'// Clone an existing enemy instead of building one\nint protoHp  = 100;\nint protoLvl = 5;\nint cloneHp  = protoHp;    // copied from the prototype\nint cloneLvl = protoLvl;\nSystem.out.println("prototype = hp " + protoHp + ", lvl " + protoLvl);\nSystem.out.println("clone     = hp " + cloneHp + ", lvl " + cloneLvl);\nSystem.out.println("identical copy? " + (cloneHp == protoHp));',
  callouts:[
    {lang:'python', body:"Prototype is built into the stdlib: <span class='key'>copy.copy</span> (shallow) and <span class='key'>copy.deepcopy</span> (deep). The same shallow-vs-deep gotcha applies — deepcopy when inner objects are mutable."},
    {lang:'js', body:"The language is literally prototype-based. <span class='key'>{...obj}</span> and <span class='key'>structuredClone(obj)</span> give shallow vs deep copies; <span class='key'>Object.create</span> makes an object from a prototype."},
    {lang:'csharp', body:"<span class='key'>MemberwiseClone()</span> is a shallow copy; <span class='key'>ICloneable</span> exists but is discouraged (ambiguous depth). Records give <span class='key'>with</span>-expressions for easy copies — the modern preference."},
  ],
  exercises:[
    {h3:'Shallow bites back', prompt:"A clone shares the same <span class='key'>int[] loadout</span> array as its prototype. What goes wrong when you edit the clone’s loadout?",
     hint:"Both change — they point at the <b>same array</b> (a shallow copy). You must deep-copy mutable fields (<span class='key'>loadout.clone()</span>) so the clone is truly independent."},
    {h3:'Why copy at all?', prompt:"Give a case where cloning a prototype is clearly better than calling a constructor.",
     hint:"When the object is <b>expensive to build</b> (heavy computation, DB/network setup) or already arranged into a complex valid state you want to reuse — copying skips redoing all that work."},
  ],
};

// ───────────────────────── 48 Bridge ─────────────────────────
MODS['48'] = {
  num:'48', slug:'bridge', title:'Bridge', navShort:'Bridge', track:T7,
  heroTitle:'Let two things <span class="grad">vary independently</span>',
  lede:"Real-world picture: a TV remote. The same remote design works with a TV, a soundbar, or a projector, and you can upgrade the remote (basic → smart) without changing the devices. Bridge splits an abstraction from its implementation so each can evolve on its own.",
  conceptH2:'Hold the implementation, don’t inherit it',
  conceptHtml:
    "<p>Suppose you have 2 kinds of remote and 3 devices. Subclassing every combination gives 6 classes — and 12 if a device is added. Bridge instead has the abstraction (<span class='key'>Remote</span>) <em>hold a reference</em> to the implementation (<span class='key'>Device</span>). Now you add classes; you don’t multiply them.</p>"+
    cb('interface Device { void setVolume(int v); }     // implementation side\nclass Tv implements Device { /* ... */ }\nclass Radio implements Device { /* ... */ }\n\nabstract class Remote {                           // abstraction side\n    protected final Device device;                // <-- the bridge\n    Remote(Device d){ this.device = d; }\n}\nclass SmartRemote extends Remote { SmartRemote(Device d){ super(d); } }\nRemote r = new SmartRemote(new Tv());            // mix any remote x any device')+
    "<p>Bridge is “prefer composition over inheritance” (module 10) applied to two dimensions of change. Recognize it when you’d otherwise get a class explosion from combining two independent hierarchies — like shapes × renderers, or messages × delivery channels.</p>",
  stages:[{t:'Remote',s:'abstraction',c:'cyan'},{t:'Device',s:'implementation',c:'purple'},{t:'remote has device',s:'the bridge',c:'amber'},{t:'vary apart',s:'add, not multiply',c:'emerald'},{t:'mix freely',s:'any combo',c:'coral'}],
  stepH2:'Cross two dimensions without the explosion',
  stepIntro:'Step through how a single reference lets remotes and devices grow independently.',
  steps:[
    {n:0, cap:'You have remotes AND devices; subclassing every combo explodes.'},
    {n:1, cap:'The <b>Remote</b> is the abstraction — what the user interacts with.'},
    {n:2, cap:'The <b>Device</b> is the implementation — TV, radio, projector.'},
    {n:3, cap:'The remote <b>holds a Device</b>; that reference is the bridge.'},
    {n:4, cap:'Now remotes and devices <b>vary independently</b> — you add, not multiply.'},
    {n:5, cap:'Mix any remote with any device <b>freely</b>.'},
  ],
  playH2:'Add, don’t multiply', playFile:'Bridge.java',
  playIntro:'Bridge turns a multiplying class count into an adding one. Model the saving.',
  playCode:'// 2 remotes x 3 devices = 6 combos, but Bridge needs only 2 + 3 classes\nint remotes = 2;\nint devices = 3;\nint combinations = remotes * devices;\nint classesWritten = remotes + devices;   // bridge: add, not multiply\nSystem.out.println("possible combinations = " + combinations);\nSystem.out.println("classes you write     = " + classesWritten);\nSystem.out.println("fewer classes? " + (classesWritten < combinations));',
  callouts:[
    {lang:'python', body:"Duck typing makes the implementation just “any object with these methods,” which you pass into the abstraction. The class explosion never threatens you the way it does in strict-inheritance languages."},
    {lang:'js', body:"Composition by passing an implementation object is the everyday approach; Bridge is just naming that discipline when two hierarchies would otherwise multiply."},
    {lang:'go', body:"Go has no inheritance, so Bridge is the default: a struct holds an interface value. Combining two axes is always composition, never a subclass grid."},
  ],
  exercises:[
    {h3:'Bridge vs Adapter', prompt:"Both involve one object holding another. How does Bridge differ in intent from Adapter (37)?",
     hint:"Adapter makes an <b>existing, incompatible</b> class fit an interface after the fact. Bridge is a <b>deliberate up-front</b> design that separates an abstraction from its implementation so both can vary independently. Adapter = retrofit; Bridge = planned."},
    {h3:'Spot the explosion', prompt:"You’re about to write <span class='key'>SmsUrgentMessage</span>, <span class='key'>SmsNormalMessage</span>, <span class='key'>EmailUrgentMessage</span>… Why is Bridge the fix?",
     hint:"Two independent axes (message type × delivery channel) are being multiplied into subclasses. Bridge holds a <span class='key'>Channel</span> reference inside <span class='key'>Message</span>, so you add a few classes per axis instead of one per combination."},
  ],
};

// ───────────────────────── 49 Composite ─────────────────────────
MODS['49'] = {
  num:'49', slug:'composite', title:'Composite', navShort:'Composite', track:T7,
  heroTitle:'Treat one and many <span class="grad">the same</span>',
  lede:"Real-world picture: folders on your computer. A folder can hold files and other folders, which hold more files and folders. Ask any of them “what’s your total size?” and it just works. Composite lets you treat individual objects and groups of objects through one uniform interface — a tree.",
  conceptH2:'Leaves and branches share an interface',
  conceptHtml:
    "<p>When data forms a part-whole tree, you don’t want callers checking “is this a single thing or a group?” everywhere. With <strong>Composite</strong>, both the leaf (a File) and the container (a Folder) implement the same interface; the container’s methods just recurse into its children.</p>"+
    cb('interface Node { int size(); }\nclass File implements Node { public int size(){ return 1; } }   // leaf\nclass Folder implements Node {                                  // composite\n    private final List<Node> children = new ArrayList<>();\n    void add(Node n){ children.add(n); }\n    public int size(){\n        int total = 0;\n        for (Node n : children) total += n.size();   // recurse uniformly\n        return total;\n    }\n}')+
    "<p>The payoff: client code calls <span class='key'>node.size()</span> without caring whether it’s a file or a deep folder tree. You see Composite in UI component trees (a panel contains buttons and panels), the file system, org charts, and abstract syntax trees.</p>",
  stages:[{t:'Node',s:'common interface',c:'cyan'},{t:'File',s:'leaf',c:'amber'},{t:'Folder',s:'composite',c:'purple'},{t:'recurse',s:'sum children',c:'emerald'},{t:'uniform',s:'treat the same',c:'coral'}],
  stepH2:'Sum a whole tree with one call',
  stepIntro:'Step through how a uniform interface lets one method work on a file or an entire folder tree.',
  steps:[
    {n:0, cap:'A folder can contain files AND other folders — a tree.'},
    {n:1, cap:'Both implement one <b>Node</b> interface.'},
    {n:2, cap:'A <b>File</b> is a leaf — it just returns its own size.'},
    {n:3, cap:'A <b>Folder</b> is a composite — it holds children.'},
    {n:4, cap:'<span class="key">size()</span> on a folder <b>recurses</b> into its children and sums.'},
    {n:5, cap:'Client code treats a file and a folder <b>identically</b>.'},
  ],
  playH2:'Whole-tree total', playFile:'Composite.java',
  playIntro:'size() on a folder sums its children, wherever they are in the tree. Model the total.',
  playCode:'// A folder\\u2019s size() recurses; the tree totals up uniformly\nint filesInRoot      = 2;\nint filesInSubfolder = 3;\nint wholeTree = filesInRoot + filesInSubfolder;\nSystem.out.println("root files      = " + filesInRoot);\nSystem.out.println("subfolder files = " + filesInSubfolder);\nSystem.out.println("whole-tree size = " + wholeTree);\nSystem.out.println("size() works the same on a file or a folder.");',
  callouts:[
    {lang:'python', body:"Model the tree with classes sharing a method, or nested lists/dicts. Recursion over the structure is identical; <span class='key'>os.walk</span> traverses the file-system composite for you."},
    {lang:'js', body:"The <b>DOM</b> is a composite tree — a node has children that are also nodes, and operations recurse. Nested arrays/objects model the same part-whole structure."},
    {lang:'csharp', body:"Identical pattern; the WPF visual tree and <span class='key'>XElement</span> (XML) are composites where containers and leaves share an interface."},
  ],
  exercises:[
    {h3:'Why uniform?', prompt:"Without Composite, what does client code have to do every time it processes a node, and why is that bad?",
     hint:"It must check <b>“is this a single item or a group?”</b> and branch — scattered <span class='key'>instanceof</span> checks everywhere. Composite removes those by giving leaves and containers the same interface, so callers just call the method."},
    {h3:'Leaf vs composite', prompt:"In a Composite, which class holds the list of children — the File or the Folder?",
     hint:"The <b>Folder</b> (the composite). The File is a leaf with no children; only the container holds and recurses over a list of child Nodes."},
  ],
};

// ───────────────────────── 50 Flyweight ─────────────────────────
MODS['50'] = {
  num:'50', slug:'flyweight', title:'Flyweight', navShort:'Flyweight', track:T7,
  heroTitle:'Share the common bits to <span class="grad">save memory</span>',
  lede:"Real-world picture: a forest in a video game with a million trees. Each tree has its own position, but they don’t each need their own copy of the 3D mesh and texture — they can all point at one shared “oak” model. Flyweight shares the common, repeated state across many objects to slash memory use.",
  conceptH2:'Split state into shared and unique',
  conceptHtml:
    "<p>The key move is separating <strong>intrinsic</strong> state (shared, the same for many objects — the mesh, the texture) from <strong>extrinsic</strong> state (unique per object — the x/y position). The intrinsic part becomes an immutable <em>flyweight</em> stored once; a factory hands out the same instance for the same key.</p>"+
    cb('class TreeType { final String mesh, texture; /* intrinsic, shared */ }\nclass Tree { final int x, y; final TreeType type; }   // type is shared\n\nclass TreeFactory {\n    private final Map<String, TreeType> cache = new HashMap<>();\n    TreeType get(String name){\n        return cache.computeIfAbsent(name, n -> new TreeType(n, n + ".png"));\n    }                                  // same instance every time\n}\nforest.add(new Tree(10, 20, factory.get("oak")));   // 1M trees, one TreeType')+
    "<p>You’ve already met a flyweight: Java caches small <span class='key'>Integer</span> objects (−128..127, module 04) and interns String literals (module 15) — both are flyweights. It’s a memory optimization, so reach for it only when you truly have a huge number of similar objects.</p>",
  stages:[{t:'1000 trees',s:'too much memory',c:'coral'},{t:'split state',s:'shared vs unique',c:'amber'},{t:'flyweight',s:'shared mesh',c:'purple'},{t:'factory caches',s:'one per type',c:'cyan'},{t:'tiny objects',s:'just position',c:'emerald'}],
  stepH2:'From thousands of meshes to one',
  stepIntro:'Step through how separating shared from unique state collapses memory use.',
  steps:[
    {n:0, cap:'A forest of 1000 trees, each storing a full mesh, blows up memory.'},
    {n:1, cap:'Split state into <b>shared</b> (intrinsic) and <b>unique</b> (extrinsic).'},
    {n:2, cap:'The shared mesh/texture becomes a <b>flyweight</b>, stored once.'},
    {n:3, cap:'A <b>factory caches</b> flyweights — same type returns the same instance.'},
    {n:4, cap:'Each tree keeps only its <b>unique position</b> plus a reference.'},
    {n:5, cap:'Memory drops from thousands of meshes to <b>one</b>.'},
  ],
  playH2:'The memory saving', playFile:'Flyweight.java',
  playIntro:'Sharing one mesh across many trees instead of copying it. Model the memory before and after.',
  playCode:'// 1000 trees: copy the mesh each, vs share one flyweight\nint trees  = 1000;\nint meshKB = 50;                  // one mesh\nint naive     = trees * meshKB;            // a mesh per tree\nint flyweight = meshKB + trees * 1;        // one mesh + tiny per-tree data\nSystem.out.println("naive memory     = " + naive + " KB");\nSystem.out.println("flyweight memory = " + flyweight + " KB");\nSystem.out.println("big saving? " + (flyweight < naive));',
  callouts:[
    {lang:'python', body:"<span class='key'>sys.intern()</span> shares identical strings, and small ints are cached — built-in flyweights, just like Java’s Integer cache and String pool. Same memory-sharing idea at the language level."},
    {lang:'js', body:"Engines intern strings and share immutable values; you apply the pattern by reusing one shared object reference across many items instead of cloning it."},
    {lang:'csharp', body:"String interning and the choice of <span class='key'>struct</span> vs <span class='key'>class</span> drive the same memory concerns. A cache returning shared immutable instances is the explicit flyweight."},
  ],
  exercises:[
    {h3:'Intrinsic vs extrinsic', prompt:"For a million on-screen characters of text, which state is intrinsic (shared) and which is extrinsic (unique)?",
     hint:"Intrinsic (shared): the <b>glyph shape/font data</b> for each character code — one ‘A’ glyph reused everywhere. Extrinsic (unique): each character’s <b>position, size, color</b> on the page. The flyweight stores the glyph once."},
    {h3:'Must it be immutable?', prompt:"Why must the shared flyweight state be immutable?",
     hint:"Because it’s shared by many objects — if one could mutate it, every object using that flyweight would change too. Immutability makes the sharing safe (and thread-safe)."},
  ],
};

// ───────────────────────── 51 Chain of Responsibility ─────────────────────────
MODS['51'] = {
  num:'51', slug:'chain-of-responsibility', title:'Chain of Responsibility', navShort:'Chain of Responsibility', track:T7,
  heroTitle:'Pass it along until <span class="grad">someone handles it</span>',
  lede:"Real-world picture: calling tech support. Tier 1 tries to help; if they can’t, they escalate to tier 2; if they can’t, it goes to a manager. Each level either handles your request or passes it on. Chain of Responsibility sends a request along a line of handlers until one deals with it.",
  conceptH2:'A line of handlers, each with a choice',
  conceptHtml:
    "<p>Instead of one big method with a tangle of <span class='key'>if/else</span> deciding who handles what, you make a chain of small <strong>handler</strong> objects. Each handler either processes the request or forwards it to the next. The sender doesn’t know (or care) which handler will deal with it.</p>"+
    cb('abstract class Handler {\n    private Handler next;\n    Handler setNext(Handler h){ this.next = h; return h; }\n    void handle(Request r) {\n        if (canHandle(r)) process(r);\n        else if (next != null) next.handle(r);   // pass it along\n    }\n    protected abstract boolean canHandle(Request r);\n}\ntier1.setNext(tier2).setNext(manager);\ntier1.handle(request);     // travels the chain until handled')+
    "<p>This decouples senders from receivers and lets you reorder or insert handlers freely. It’s the backbone of request pipelines: servlet <span class='key'>Filter</span> chains, logging handlers, and validation pipelines all work this way (it’s the same idea as web “middleware”).</p>",
  stages:[{t:'request',s:'enters chain',c:'cyan'},{t:'handler 1',s:'can handle?',c:'amber'},{t:'pass along',s:'to next',c:'purple'},{t:'handler 2',s:'handles it',c:'emerald'},{t:'or unhandled',s:'falls off end',c:'coral'}],
  stepH2:'Escalate until handled',
  stepIntro:'Step through a request travelling down a chain until a handler accepts it.',
  steps:[
    {n:0, cap:'A request might be handled at any of several levels.'},
    {n:1, cap:'It enters the chain at the <b>first handler</b>.'},
    {n:2, cap:'Handler 1 checks whether it <b>can handle</b> it.'},
    {n:3, cap:'If not, it <b>passes the request</b> to the next handler.'},
    {n:4, cap:'A later handler (tier 2) <b>handles it</b>.'},
    {n:5, cap:'If no one can, the request <b>falls off the end</b> unhandled.'},
  ],
  playH2:'Who handles it?', playFile:'Chain.java',
  playIntro:'A request escalates until a tier’s limit can cover it. Model which tier handles a $500 request.',
  playCode:'// A request escalates until a tier can handle it\nint request    = 500;\nint tier1Limit = 100;\nint tier2Limit = 1000;\nSystem.out.println("request = " + request);\nSystem.out.println("tier1 handles? " + (request <= tier1Limit));   // false\nSystem.out.println("tier2 handles? " + (request <= tier2Limit));   // true\nSystem.out.println("passed along until someone could handle it.");',
  callouts:[
    {lang:'python', body:"A list of handler callables you try in order, or WSGI middleware wrapping an app. Logging’s handler hierarchy (record propagates up to parent loggers) is chain-of-responsibility in the stdlib."},
    {lang:'js', body:"This <b>is</b> Express/Koa middleware — each function gets <span class='key'>next()</span> and either responds or passes control along. You use the pattern every time you write a middleware stack."},
    {lang:'csharp', body:"ASP.NET Core’s middleware pipeline and <span class='key'>DelegatingHandler</span> chains for HttpClient are exactly this — each link handles or calls the next."},
  ],
  exercises:[
    {h3:'Why not one big if/else?', prompt:"What does a handler chain give you that a single method full of <span class='key'>if/else</span> branches doesn’t?",
     hint:"You can <b>add, remove, and reorder</b> handlers independently without touching a giant method, and senders stay decoupled from who handles the request. Each handler is small and testable on its own (also better for Open/Closed)."},
    {h3:'Unhandled requests', prompt:"What happens if a request reaches the end of the chain and no handler accepted it? How might you design for that?",
     hint:"By default it’s silently dropped. Add a <b>default/fallback handler</b> at the end that always handles (logs an error, returns a 404, etc.) so nothing falls through unnoticed."},
  ],
};

// ───────────────────────── 52 Iterator ─────────────────────────
MODS['52'] = {
  num:'52', slug:'iterator', title:'Iterator', navShort:'Iterator', track:T7,
  heroTitle:'Walk a collection <span class="grad">without peeking inside</span>',
  lede:"Real-world picture: pressing “next” on a music playlist. You move song by song without knowing or caring whether the playlist is stored as an array, a linked list, or shuffled on the fly. Iterator gives a standard way to traverse a collection without exposing how it’s built.",
  conceptH2:'A cursor with hasNext() and next()',
  conceptHtml:
    "<p>An <strong>iterator</strong> is a little cursor object that knows how to walk one collection. Callers ask <span class='key'>hasNext()</span> and <span class='key'>next()</span> and never touch the underlying array or tree. Java builds this in: implement <span class='key'>Iterable</span> and your type works with the for-each loop.</p>"+
    cb('List<String> names = List.of("Ada", "Alan", "Grace");\nIterator<String> it = names.iterator();\nwhile (it.hasNext()) {\n    String n = it.next();     // advance without touching internal storage\n}\n\n// for-each is just sugar over the iterator:\nfor (String n : names) { /* ... */ }')+
    "<p>Because the traversal is decoupled from the structure, the same loop works over an <span class='key'>ArrayList</span>, a <span class='key'>HashSet</span>, or your own custom tree. You can even have multiple independent iterators over one collection, and lazy iterators that compute items on demand (the spirit of Streams, module 21).</p>",
  stages:[{t:'iterator()',s:'get a cursor',c:'cyan'},{t:'hasNext()',s:'more?',c:'amber'},{t:'next()',s:'one item',c:'purple'},{t:'repeat',s:'walk along',c:'emerald'},{t:'done',s:'internals hidden',c:'coral'}],
  stepH2:'Step a cursor through the items',
  stepIntro:'Step through a traversal that never reveals whether the collection is an array or a tree.',
  steps:[
    {n:0, cap:'You want to walk a collection without knowing its internal structure.'},
    {n:1, cap:'Ask the collection for an <b>iterator</b> (a cursor).'},
    {n:2, cap:'<span class="key">hasNext()</span> asks whether <b>more items</b> remain.'},
    {n:3, cap:'<span class="key">next()</span> returns the current item and <b>advances</b>.'},
    {n:4, cap:'<b>Repeat</b> until you’ve walked them all.'},
    {n:5, cap:'The collection’s <b>internal structure stayed hidden</b> the whole time.'},
  ],
  playH2:'Traverse to the end', playFile:'Iterator.java',
  playIntro:'Each next() advances the cursor one step. Model visiting every item.',
  playCode:'// Step through items with next(), without knowing the structure\nint items   = 4;\nint visited = 0;\nvisited = visited + 1;   // next()\nvisited = visited + 1;\nvisited = visited + 1;\nvisited = visited + 1;\nSystem.out.println("items = " + items);\nSystem.out.println("visited via next() = " + visited);\nSystem.out.println("traversed all? " + (visited == items));',
  callouts:[
    {lang:'python', body:"First-class in the language: <span class='key'>__iter__</span>/<span class='key'>__next__</span>, and <b>generators</b> (<span class='key'>yield</span>) make lazy iterators trivial. <span class='key'>for x in coll</span> is the same as Java’s for-each over an Iterable."},
    {lang:'js', body:"<span class='key'>Symbol.iterator</span> + generators give the same protocol, consumed by <span class='key'>for...of</span>. Implement the iterator protocol and your object works everywhere arrays do."},
    {lang:'csharp', body:"<span class='key'>IEnumerable&lt;T&gt;</span>/<span class='key'>IEnumerator&lt;T&gt;</span> with <span class='key'>yield return</span> for lazy iterators, consumed by <span class='key'>foreach</span> — a near-exact mirror of Java’s Iterable/Iterator."},
  ],
  exercises:[
    {h3:'Why hide the structure?', prompt:"How does returning an Iterator let a library switch a collection from an array to a tree without breaking callers?",
     hint:"Callers only use <span class='key'>hasNext()</span>/<span class='key'>next()</span>, never the internal storage. As long as the new structure provides an iterator, the same loops keep working — the traversal is decoupled from the representation."},
    {h3:'Concurrent modification', prompt:"You remove from a list while iterating it with for-each and get a <span class='key'>ConcurrentModificationException</span>. Why, and the fix?",
     hint:"The iterator detects the list changed underneath it. Use the iterator’s own <span class='key'>it.remove()</span>, or collect items to remove and delete them after the loop (or use <span class='key'>removeIf</span>)."},
  ],
};

// ───────────────────────── 53 Mediator ─────────────────────────
MODS['53'] = {
  num:'53', slug:'mediator', title:'Mediator', navShort:'Mediator', track:T7,
  heroTitle:'Route everything through <span class="grad">one hub</span>',
  lede:"Real-world picture: an air traffic control tower. Planes never coordinate landings by talking to each other directly — that would be chaos. They all talk to the tower, and the tower coordinates everyone. Mediator centralizes communication so components don’t depend on each other directly.",
  conceptH2:'Replace a tangle of links with a hub',
  conceptHtml:
    "<p>When many objects all reference each other, you get a tangled web — every component knows about every other. A <strong>mediator</strong> sits in the middle: each component talks only to the mediator, and the mediator orchestrates who needs to know what. Components become simple and reusable.</p>"+
    cb('interface Tower { void requestLanding(Plane p); }    // the mediator\nclass Plane {\n    private final Tower tower;\n    Plane(Tower t){ this.tower = t; }\n    void land(){ tower.requestLanding(this); }   // talk to the tower, not peers\n}\n// Planes are decoupled; the ControlTower decides ordering & spacing.')+
    "<p>Think of a complex dialog box where enabling one field changes others — a mediator coordinates the widgets instead of each widget knowing all the rest. The risk: the mediator can grow into a “god object,” so keep its job to coordination, not business logic. (The C# <span class='key'>MediatR</span> library is named for this pattern.)</p>",
  stages:[{t:'tangled web',s:'all-to-all',c:'coral'},{t:'add a mediator',s:'the hub',c:'purple'},{t:'talk to hub',s:'not peers',c:'cyan'},{t:'hub coordinates',s:'routes messages',c:'amber'},{t:'decoupled',s:'fewer links',c:'emerald'}],
  stepH2:'Untangle the web',
  stepIntro:'Step through replacing direct component-to-component links with a single coordinating hub.',
  steps:[
    {n:0, cap:'Many components talking directly become a tangled web.'},
    {n:1, cap:'Introduce a <b>mediator</b> — a central hub.'},
    {n:2, cap:'Each component talks <b>only to the hub</b>, never to peers.'},
    {n:3, cap:'The hub <b>coordinates</b> and routes between them.'},
    {n:4, cap:'Components no longer <b>depend on each other</b>.'},
    {n:5, cap:'Connections drop from everyone-to-everyone down to <b>each-to-hub</b>.'},
  ],
  playH2:'Fewer connections', playFile:'Mediator.java',
  playIntro:'Direct links grow as n(n-1)/2; a mediator makes it linear. Model the drop for 4 components.',
  playCode:'// 4 components: direct links vs links via one mediator hub\nint components = 4;\nint directLinks   = components * (components - 1) / 2;   // n(n-1)/2 = 6\nint mediatedLinks = components;                          // each -> hub = 4\nSystem.out.println("direct (all-to-all) links = " + directLinks);\nSystem.out.println("via mediator hub          = " + mediatedLinks);\nSystem.out.println("fewer connections? " + (mediatedLinks < directLinks));',
  callouts:[
    {lang:'python', body:"An event bus or a central controller object plays the mediator. Components publish to / subscribe via the hub rather than importing and calling each other directly."},
    {lang:'js', body:"“Lifting state up” in React is mediator thinking — a parent coordinates sibling components so they don’t talk directly. An event-emitter hub is the explicit version."},
    {lang:'csharp', body:"The popular <span class='key'>MediatR</span> library is this pattern by name: senders dispatch messages to a mediator that routes them to handlers, decoupling the two."},
  ],
  exercises:[
    {h3:'The god-object risk', prompt:"What’s the main danger of the Mediator pattern, and how do you keep it in check?",
     hint:"The mediator can balloon into a <b>god object</b> that knows and does everything. Keep it focused on <em>coordination/routing</em> and push actual business logic back into the components or dedicated services."},
    {h3:'Mediator vs Observer', prompt:"Observer (42) also decouples senders and receivers. How is Mediator different?",
     hint:"Observer is <b>one-to-many broadcast</b>: a subject notifies many observers that don’t interact. Mediator is <b>many-to-many coordination</b>: a central hub manages bidirectional interactions among several peers."},
  ],
};

// ───────────────────────── 54 Memento ─────────────────────────
MODS['54'] = {
  num:'54', slug:'memento', title:'Memento', navShort:'Memento', track:T7,
  heroTitle:'Save a snapshot, <span class="grad">roll back later</span>',
  lede:"Real-world picture: a save point in a video game. Before the boss fight you save; if it goes badly, you reload exactly where you were. Memento captures an object’s state so you can restore it later — the machinery behind undo and checkpoints.",
  conceptH2:'Capture state without breaking encapsulation',
  conceptHtml:
    "<p>You want to snapshot an object’s state and restore it later, but without exposing its private fields to the outside world. The object itself creates a <strong>memento</strong> (an opaque snapshot) and can restore from one. A <em>caretaker</em> holds mementos but can’t read inside them.</p>"+
    cb('class Editor {\n    private String text = "";\n    Memento save(){ return new Memento(text); }         // snapshot self\n    void restore(Memento m){ this.text = m.state(); }    // roll back\n}\nrecord Memento(String state) {}     // opaque saved state\n\nMemento checkpoint = editor.save();\neditor.type("oops");\neditor.restore(checkpoint);          // undo back to the snapshot')+
    "<p>Push mementos onto a stack and you have multi-level undo (pair it with Command, module 43, for redo). The cost is memory — full snapshots of large state add up — so real editors often store <em>diffs</em> instead of complete copies.</p>",
  stages:[{t:'object state',s:'now',c:'cyan'},{t:'save()',s:'snapshot',c:'purple'},{t:'memento',s:'opaque copy',c:'amber'},{t:'change on',s:'mutate freely',c:'emerald'},{t:'restore()',s:'roll back',c:'coral'}],
  stepH2:'Snapshot, change, restore',
  stepIntro:'Step through capturing state and rolling back to it — the core of undo.',
  steps:[
    {n:0, cap:'You want to undo: capture a state now and return to it later.'},
    {n:1, cap:'The object’s <b>current state</b> is what we’ll snapshot.'},
    {n:2, cap:'<span class="key">save()</span> produces a <b>memento</b> — a snapshot.'},
    {n:3, cap:'The memento holds the state <b>opaquely</b> (the caretaker can’t peek inside).'},
    {n:4, cap:'The object keeps <b>changing</b> afterwards.'},
    {n:5, cap:'<span class="key">restore(memento)</span> <b>rolls it back</b> to the saved snapshot.'},
  ],
  playH2:'Undo to the snapshot', playFile:'Memento.java',
  playIntro:'Save a value, change it, then restore. Model the round-trip back to the snapshot.',
  playCode:'// Save a snapshot, change state, then restore it\nint score = 100;\nint saved = score;     // memento captures the state\nscore = 250;           // play on...\nscore = saved;         // restore from the memento\nSystem.out.println("saved snapshot = " + saved);\nSystem.out.println("after restore  = " + score);\nSystem.out.println("back to saved? " + (score == saved));',
  callouts:[
    {lang:'python', body:"Copy state into a snapshot (a dict, a dataclass, or via <span class='key'>copy.deepcopy</span>); <span class='key'>pickle</span> serializes deep state. The opaque-snapshot idea maps directly."},
    {lang:'js', body:"<span class='key'>structuredClone</span> or spread snapshots capture state; Redux stores a history of states for time-travel debugging — Memento at scale."},
    {lang:'csharp', body:"Capture state in a <span class='key'>record</span> (immutable snapshot) or serialize for deep copies. Same caretaker/originator split."},
  ],
  exercises:[
    {h3:'Who can read the memento?', prompt:"Why should the caretaker (e.g. an undo-history list) NOT be able to read a memento’s contents?",
     hint:"To preserve <b>encapsulation</b> — only the originating object should understand and use its own saved state. The caretaker just stores and returns mementos; if it could read/modify them it would couple to the object’s internals."},
    {h3:'The memory cost', prompt:"Full-snapshot undo on a large document gets expensive. What’s a common optimization?",
     hint:"Store <b>diffs/deltas</b> (just what changed) instead of complete copies, or limit history depth. Reconstruct a past state by applying/reversing the recorded changes rather than keeping every full snapshot."},
  ],
};

// ───────────────────────── 55 Visitor ─────────────────────────
MODS['55'] = {
  num:'55', slug:'visitor', title:'Visitor', navShort:'Visitor', track:T7,
  heroTitle:'Add operations <span class="grad">without touching the classes</span>',
  lede:"Real-world picture: a tax auditor visiting different account types. The auditor knows how to assess a savings account, a checking account, a loan — but the accounts themselves don’t contain audit logic. Visitor lets you add new operations across a set of classes without modifying those classes.",
  conceptH2:'Move the operation out, into a visitor',
  conceptHtml:
    "<p>Imagine a hierarchy of element types and you keep needing new operations over all of them (calculate tax, export, validate). Editing every class for each new operation violates Open/Closed (module 12). <strong>Visitor</strong> puts each operation in its own class; elements <span class='key'>accept</span> a visitor and call back the right method (double dispatch).</p>"+
    cb('interface Visitor { int visit(Savings s); int visit(Checking c); }\ninterface Account { int accept(Visitor v); }\nclass Savings  implements Account { public int accept(Visitor v){ return v.visit(this); } }\nclass Checking implements Account { public int accept(Visitor v){ return v.visit(this); } }\n\nclass TaxVisitor implements Visitor {       // a whole operation in one place\n    public int visit(Savings s){ return s.balance / 100; }\n    public int visit(Checking c){ return c.balance / 50; }\n}')+
    "<p>Now adding an <em>operation</em> (an AuditVisitor, an ExportVisitor) means writing one new class and touching none of the elements. The trade-off is the mirror image of Composite/Abstract Factory: adding a new <em>element type</em> means updating every visitor. Use it when the class set is stable but operations keep growing.</p>",
  stages:[{t:'Account types',s:'object structure',c:'cyan'},{t:'accept(visitor)',s:'double dispatch',c:'purple'},{t:'visit(this)',s:'right overload',c:'amber'},{t:'new operation',s:'new visitor',c:'emerald'},{t:'classes untouched',s:'open/closed',c:'coral'}],
  stepH2:'Double dispatch to the right method',
  stepIntro:'Step through how an element and a visitor cooperate so the correct type-specific logic runs.',
  steps:[
    {n:0, cap:'You want to add operations across a class hierarchy without editing it.'},
    {n:1, cap:'The <b>object structure</b> is a set of element types (Savings, Checking).'},
    {n:2, cap:'Each element <span class="key">accept</span>s a visitor and calls back (<b>double dispatch</b>).'},
    {n:3, cap:'The visitor’s <b>matching visit()</b> runs the type-specific logic.'},
    {n:4, cap:'A brand-new operation is just a <b>new Visitor</b> class.'},
    {n:5, cap:'The element classes are <b>never modified</b> — open for extension.'},
  ],
  playH2:'One visitor, many types', playFile:'Visitor.java',
  playIntro:'A tax visitor computes differently per account type. Model the two results and their total.',
  playCode:'// A TaxVisitor applies type-specific logic to each account\nint savings  = 1000;\nint checking = 2000;\nint savingsTax  = savings / 100;    // visit(Savings): 1%\nint checkingTax = checking / 50;    // visit(Checking): 2%\nSystem.out.println("savings tax  = " + savingsTax);\nSystem.out.println("checking tax = " + checkingTax);\nSystem.out.println("total tax = " + (savingsTax + checkingTax));',
  callouts:[
    {lang:'python', body:"<span class='key'>functools.singledispatch</span> gives visitor-like dispatch on argument type without the accept/visit boilerplate — a lighter way to add type-specific operations from outside the classes."},
    {lang:'js', body:"No method overloading, so you dispatch on a <span class='key'>type</span> tag or keep a map of {type: handler}. The intent — add operations without editing the data classes — carries over."},
    {lang:'csharp', body:"Modern C# often replaces Visitor with <b>pattern-matching switches</b> on type (<span class='key'>switch (acct) { case Savings s =&gt; ... }</span>) — same goal, far less ceremony, though it centralizes rather than uses double dispatch."},
  ],
  exercises:[
    {h3:'What’s double dispatch?', prompt:"Why does the element call <span class='key'>v.visit(this)</span> instead of the visitor just calling a method on the element?",
     hint:"To resolve <b>two types at once</b>: which visitor (the operation) and which element (the data type). The <span class='key'>accept</span> picks the element type; <span class='key'>visit(this)</span> then picks the right overload. Java’s single dispatch alone can’t select on both."},
    {h3:'When NOT to use it', prompt:"Visitor makes adding operations easy but adding element types hard. When is that the wrong trade-off?",
     hint:"When your <b>set of element types changes often</b> — each new type forces edits to every visitor. Visitor fits a <b>stable class hierarchy</b> with a <b>growing list of operations</b>, not the reverse."},
  ],
};

// ───────────────────────── 56 Interpreter ─────────────────────────
MODS['56'] = {
  num:'56', slug:'interpreter', title:'Interpreter', navShort:'Interpreter', track:T7,
  heroTitle:'Give a <span class="grad">mini-language</span> meaning',
  lede:"Real-world picture: a calculator reading “2 + 3 × 4”. It turns the text into a structure and evaluates it by the rules of arithmetic. Interpreter defines a grammar for a little language and an object structure that evaluates sentences in it — the idea behind calculators, regex engines, and query languages.",
  conceptH2:'A class per grammar rule, evaluated as a tree',
  conceptHtml:
    "<p>For a small, well-defined language, you can model each grammar rule as a class implementing a common <span class='key'>Expr</span> interface. <em>Terminal</em> expressions are leaves (a number); <em>non-terminal</em> ones combine children (add, multiply). Parsing builds a tree; calling <span class='key'>eval()</span> on the root recurses to a result.</p>"+
    cb('interface Expr { int eval(); }\nclass Num implements Expr { final int v; public int eval(){ return v; } }      // terminal\nclass Add implements Expr { final Expr l, r; public int eval(){ return l.eval() + r.eval(); } }\nclass Mul implements Expr { final Expr l, r; public int eval(){ return l.eval() * r.eval(); } }\n\n// "2 + 3 * 4"  ->  Add(Num 2, Mul(Num 3, Num 4))\nExpr tree = new Add(new Num(2), new Mul(new Num(3), new Num(4)));\nint result = tree.eval();     // 14  (precedence is baked into the tree shape)')+
    "<p>Notice precedence is captured by the tree’s <em>shape</em>, not by the eval logic — exactly the lesson from module 03 (bytecode) and the operator-precedence fix in this very course’s playground. Interpreter shines for simple grammars (rules engines, filters, formulas); for anything large, use a real parser generator instead of hand-rolling classes.</p>",
  stages:[{t:'grammar',s:'rules',c:'cyan'},{t:'parse',s:'to a tree',c:'amber'},{t:'Num / Add / Mul',s:'expression nodes',c:'purple'},{t:'eval()',s:'recurse tree',c:'emerald'},{t:'result',s:'a value',c:'coral'}],
  stepH2:'From text to a value',
  stepIntro:'Step through turning a little expression into a tree and evaluating it bottom-up.',
  steps:[
    {n:0, cap:'You have a little language — e.g. "2 + 3 * 4" — to evaluate.'},
    {n:1, cap:'A <b>grammar</b> defines its rules (numbers, +, ×, precedence).'},
    {n:2, cap:'<b>Parsing</b> turns the text into an expression tree.'},
    {n:3, cap:'Each node is an <span class="key">Expr</span>: <b>Num</b> leaves, <b>Add/Mul</b> branches.'},
    {n:4, cap:'<span class="key">eval()</span> <b>recurses</b> the tree, combining children.'},
    {n:5, cap:'The root returns the <b>final value</b> — precedence baked into the tree shape.'},
  ],
  playH2:'Evaluate the tree', playFile:'Interpreter.java',
  playIntro:'Evaluate the parsed tree for "2 + 3 * 4" bottom-up. Model the sub-result then the root.',
  playCode:'// Evaluate Add(Num 2, Mul(Num 3, Num 4)) bottom-up\nint mulSubtree = 3 * 4;          // the Mul node\nint result = 2 + mulSubtree;     // the Add node at the root\nSystem.out.println("3 * 4 subtree = " + mulSubtree);\nSystem.out.println("2 + (3*4)     = " + result);\nSystem.out.println("grammar evaluated to " + result);',
  callouts:[
    {lang:'python', body:"The <span class='key'>ast</span> module parses Python into an expression tree you can walk — Interpreter in the standard library. Building small expression-tree evaluators is a common Python task."},
    {lang:'js', body:"Every transpiler (Babel) parses code into an AST and processes it — the same pattern at industrial scale. Hand-rolled rule/formula evaluators use the small version."},
    {lang:'csharp', body:"<span class='key'>System.Linq.Expressions</span> builds and compiles expression trees at runtime — an interpreter/compiler for a mini-language, used heavily by ORMs to translate lambdas into SQL."},
  ],
  exercises:[
    {h3:'Where’s the precedence?', prompt:"In <span class='key'>Add(Num 2, Mul(Num 3, Num 4))</span>, nothing in <span class='key'>eval()</span> mentions precedence. How does 3×4 still happen before the +?",
     hint:"It’s encoded in the <b>tree shape</b>: the Mul node is a child of the Add node, so <span class='key'>eval()</span> must evaluate Mul first to get the Add’s right operand. The parser put precedence into the structure, not the evaluator."},
    {h3:'When to stop hand-rolling', prompt:"Interpreter works for a calculator. Why is it a poor choice for a full programming language?",
     hint:"The number of grammar rules (and classes) explodes, and hand-written parsing gets unmanageable. For anything beyond a small grammar, use a <b>parser generator</b> (ANTLR) or an existing engine rather than a class per rule."},
  ],
};

module.exports = { MODS };
