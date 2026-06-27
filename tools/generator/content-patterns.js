// content-patterns.js — Track 6: Design Patterns (modules 34–45). Beginner-friendly, real-world analogies.
const attrEsc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const cb = src => '<pre class="code" data-src="'+attrEsc(src)+'"></pre>';
const T6 = 'Track 6: Design Patterns';
const MODS = {};

// ───────────────────────── 34 Singleton ─────────────────────────
MODS['34'] = {
  num:'34', slug:'singleton', title:'Singleton', navShort:'Singleton', track:T6,
  heroTitle:'Exactly <span class="grad">one</span> of something',
  lede:"Real-world picture: a country has exactly one sitting president. No matter who asks “who’s the president?”, everyone gets the same person. The Singleton pattern guarantees a class has just one instance and gives everyone a single, shared way to reach it.",
  conceptH2:'One instance, one global access point',
  conceptHtml:
    "<p>Some things should exist only once: an app’s configuration, a connection pool, a logger. Singleton makes the class itself responsible for that. The trick: make the <strong>constructor private</strong> so no one can <span class='key'>new</span> it, create the one instance internally, and hand it out through a static method.</p>"+
    cb('public final class Settings {\n    private static final Settings INSTANCE = new Settings();  // the one\n    private Settings() {}                 // private: no `new Settings()` outside\n    public static Settings get() { return INSTANCE; }\n}\n\nSettings a = Settings.get();\nSettings b = Settings.get();           // a == b  (same object)\n\n// Modern, thread-safe, serialization-safe form: an enum\nenum Config { INSTANCE; int port = 8080; }')+
    "<p>The enum form is the idiom most Java pros prefer — the JVM guarantees a single instance for free. A caution: a Singleton is global state, so overusing it makes code hard to test. Reach for it when “exactly one” is a genuine rule, and prefer dependency injection (module 29) when you just want to share an object.</p>",
  stages:[{t:'private ctor',s:'no new outside',c:'coral'},{t:'static INSTANCE',s:'created once',c:'purple'},{t:'get()',s:'global access',c:'cyan'},{t:'same object',s:'every call',c:'emerald'},{t:'enum form',s:'thread-safe',c:'amber'}],
  stepH2:'How a class enforces “only one”',
  stepIntro:'Step through the mechanics that make a second instance impossible — and the enum shortcut that does it for you.',
  steps:[
    {n:0, cap:'We want exactly one configuration object for the whole app.'},
    {n:1, cap:'The <b>constructor is private</b>, so outside code can never write <span class="key">new Settings()</span>.'},
    {n:2, cap:'The class holds one <b>static INSTANCE</b>, created a single time when the class loads.'},
    {n:3, cap:'<b>get()</b> is the only door in — it returns that one instance.'},
    {n:4, cap:'Every caller gets the <b>same object</b>, so shared state stays consistent.'},
    {n:5, cap:'An <b>enum</b> with one constant is the simplest thread-safe singleton — the JVM guarantees it.'},
  ],
  playH2:'Same instance every time', playFile:'Singleton.java',
  playIntro:'Two calls to get() return the identical object. Model their identity check.',
  playCode:'// Every get() returns the SAME instance\nint firstId  = 1001;     // identity of the one instance\nint secondId = 1001;     // get() again -> same object\nSystem.out.println("first  get() id = " + firstId);\nSystem.out.println("second get() id = " + secondId);\nSystem.out.println("same instance? " + (firstId == secondId));',
  callouts:[
    {lang:'python', body:"A Python <b>module</b> is itself a singleton — import it anywhere and you share one namespace, so people often just use a module-level object. The explicit pattern uses a classmethod or <span class='key'>__new__</span> guard, but it’s needed far less."},
    {lang:'js', body:"An ES <b>module</b> (or a single exported object literal) is a natural singleton — every <span class='key'>import</span> gets the same instance. Java needs the private-constructor ceremony because every class is instantiable by default."},
    {lang:'csharp', body:"Same idea: a private constructor + static instance, or <span class='key'>Lazy&lt;T&gt;</span> for thread-safe lazy init. A static class is the “no instance at all” cousin. The Java enum trick has no direct C# equivalent."},
  ],
  exercises:[
    {h3:'Why private constructor?', prompt:"What stops calling code from just writing <span class='key'>new Settings()</span> and making a second instance?",
     hint:"The <b>private</b> constructor — it’s only accessible inside the class itself, so external code can’t invoke it. The single instance is created internally and handed out via the static accessor."},
    {h3:'The hidden cost', prompt:"Why can heavy use of Singletons make a codebase hard to unit-test?",
     hint:"A Singleton is global, shared, mutable state reached implicitly (not passed in), so tests can’t easily substitute a fake or reset it between runs. Prefer injecting the dependency (DI) when you only need sharing, not a hard “exactly one” guarantee."},
  ],
};

// ───────────────────────── 35 Factory Method ─────────────────────────
MODS['35'] = {
  num:'35', slug:'factory-method', title:'Factory Method', navShort:'Factory', track:T6,
  heroTitle:'Order a product <span class="grad">without naming the class</span>',
  lede:"Real-world picture: you walk into a pizza place and order “a veggie pizza.” You don’t reach into the kitchen and assemble it yourself — the store decides exactly how to make it. Factory Method puts object creation behind a method so callers ask for what they want, not how to build it.",
  conceptH2:'Defer the “new” to a method subclasses control',
  conceptHtml:
    "<p>Hardcoding <span class='key'>new VeggiePizza()</span> everywhere couples your code to concrete classes. A <strong>factory method</strong> wraps the <span class='key'>new</span> in an overridable method, so subclasses (or configuration) decide which concrete type to create, and callers depend only on an interface.</p>"+
    cb('interface Pizza { int prepTime(); }\nclass Veggie implements Pizza { public int prepTime(){ return 15; } }\nclass Meat   implements Pizza { public int prepTime(){ return 20; } }\n\nabstract class PizzaStore {\n    Pizza order(String type) { return create(type); }   // uses the factory\n    protected abstract Pizza create(String type);        // the factory method\n}\n// A NyPizzaStore subclass decides which concrete Pizza `create` returns.')+
    "<p>You see factory methods all over the JDK: <span class='key'>List.of(...)</span>, <span class='key'>Integer.valueOf(...)</span>, <span class='key'>LocalDate.now()</span>. They give better names than constructors, can return cached instances, and can hand back a subtype — flexibility a raw constructor can’t.</p>",
  stages:[{t:'order(type)',s:'client asks',c:'cyan'},{t:'create()',s:'factory method',c:'amber'},{t:'subclass decides',s:'which class',c:'purple'},{t:'new Concrete',s:'hidden inside',c:'coral'},{t:'Pizza',s:'returned',c:'emerald'}],
  stepH2:'From an order to a built product',
  stepIntro:'Step through how a request becomes an object without the caller ever naming a concrete class.',
  steps:[
    {n:0, cap:'You want a pizza, but not to hardwire which class your code builds.'},
    {n:1, cap:'You call <span class="key">order("veggie")</span> on the store — describing what, not how.'},
    {n:2, cap:'The store’s <b>factory method</b> <span class="key">create()</span> is responsible for construction.'},
    {n:3, cap:'A <b>subclass decides</b> the concrete class to instantiate (NY style vs Chicago style).'},
    {n:4, cap:'<span class="key">new VeggiePizza()</span> happens <b>inside</b>, hidden from the caller.'},
    {n:5, cap:'You get a <span class="key">Pizza</span> back — decoupled from its concrete type.'},
  ],
  playH2:'Order without “new”', playFile:'Factory.java',
  playIntro:'The factory builds the right product and reports its prep time; you never named the concrete class.',
  playCode:'// You ordered a type; the factory chose the class and its prep time\nString type = "veggie";\nint prep = 15;       // the chosen pizza knows its own times\nint bake = 10;\nSystem.out.println("ordered: " + type + " pizza");\nSystem.out.println("ready in " + (prep + bake) + " min");\nSystem.out.println("caller never wrote new VeggiePizza().");',
  callouts:[
    {lang:'python', body:"With duck typing you often skip interfaces and just use a <b>factory function</b> that returns whatever object fits. Java’s version is more formal (an interface + an overridable method) but achieves the same decoupling."},
    {lang:'js', body:"A plain <b>factory function</b> returning an object is the everyday JS equivalent — no <span class='key'>class</span> required. Java leans on an interface return type so the compiler enforces the contract."},
    {lang:'csharp', body:"Nearly identical — a virtual/abstract factory method or a static factory. C#’s <span class='key'>static</span> creation methods (e.g. <span class='key'>Task.FromResult</span>) mirror Java’s <span class='key'>List.of</span> / <span class='key'>valueOf</span> style."},
  ],
  exercises:[
    {h3:'Why not a constructor?', prompt:"Give two things a static factory method can do that a plain constructor cannot.",
     hint:"It can have a <b>meaningful name</b> (<span class='key'>List.of</span> vs another overload), <b>return a cached</b> or shared instance instead of always allocating, and <b>return a subtype</b> of the declared type. Constructors must create a new object of exactly their class."},
    {h3:'Spot the coupling', prompt:"Code is littered with <span class='key'>new MySqlConnection()</span>. How does a factory method make swapping to Postgres easier?",
     hint:"Centralize creation in one factory that returns a <span class='key'>Connection</span> interface. Callers depend on the interface, so switching databases means changing one factory, not every <span class='key'>new</span> call site."},
  ],
};

// ───────────────────────── 36 Builder ─────────────────────────
MODS['36'] = {
  num:'36', slug:'builder', title:'Builder', navShort:'Builder', track:T6,
  heroTitle:'Build it <span class="grad">step by step</span>',
  lede:"Real-world picture: ordering a custom burger — you start with a bun and add patties, cheese, bacon, sauce, one choice at a time, then say “done.” Builder constructs a complex object piece by piece, so you don’t need a monster constructor with ten arguments.",
  conceptH2:'Readable construction for objects with many parts',
  conceptHtml:
    "<p>A constructor with many parameters — especially optional ones — becomes unreadable: <span class='key'>new Burger(2, true, false, true, 0, true)</span>. Which <span class='key'>true</span> is the bacon? A <strong>Builder</strong> replaces that with named, chained steps and produces an immutable result at the end.</p>"+
    cb('Burger b = new Burger.Builder()\n    .patties(2)\n    .cheese(true)\n    .bacon(true)\n    .build();          // assembles and returns an immutable Burger\n\n// The builder also validates once, in build(), before constructing.')+
    "<p>You’ve used builders without noticing: <span class='key'>StringBuilder</span>, <span class='key'>HttpRequest.newBuilder()</span>, stream collectors. They shine when an object has many optional fields, when you want the result immutable (module 08), or when construction needs validation before the object exists.</p>",
  stages:[{t:'new Builder',s:'start',c:'cyan'},{t:'.patties(2)',s:'set a part',c:'amber'},{t:'.cheese(true)',s:'chain calls',c:'purple'},{t:'.build()',s:'assemble',c:'emerald'},{t:'Burger',s:'immutable',c:'coral'}],
  stepH2:'Assemble a burger one call at a time',
  stepIntro:'Step through chained construction that ends in a single, fully-built, immutable object.',
  steps:[
    {n:0, cap:'A Burger has many optional parts — a single big constructor would be unreadable.'},
    {n:1, cap:'Start with a fresh <b>Builder</b>.'},
    {n:2, cap:'Set one part at a time with a named call: <span class="key">.patties(2)</span>.'},
    {n:3, cap:'<b>Chain</b> more readable steps: <span class="key">.cheese(true).bacon(true)</span>.'},
    {n:4, cap:'<b>.build()</b> validates and assembles everything in one shot.'},
    {n:5, cap:'You get an <b>immutable</b> Burger; the same builder can make different burgers.'},
  ],
  playH2:'Count the layers', playFile:'Builder.java',
  playIntro:'Each builder call adds a part. Model the assembled total.',
  playCode:'// Building a burger step by step\nint patties = 2;\nint cheese  = 1;\nint bacon   = 1;\nint layers = patties + cheese + bacon;\nSystem.out.println("patties + cheese + bacon = " + layers + " layers");\nSystem.out.println("burger built? " + (layers > 0));\nSystem.out.println("Same builder, different burgers.");',
  callouts:[
    {lang:'python', body:"Python’s <b>keyword arguments</b> and <span class='key'>@dataclass</span> defaults cover many builder use-cases directly: <span class='key'>Burger(patties=2, bacon=True)</span>. Java lacks named/optional parameters, which is exactly why the Builder pattern is so common there."},
    {lang:'js', body:"An <b>options object</b> — <span class='key'>makeBurger({ patties: 2, bacon: true })</span> — is the usual JS substitute. Builders still appear for fluent, validated, immutable construction (e.g. query builders)."},
    {lang:'csharp', body:"<b>Object initializers</b> (<span class='key'>new Burger { Patties = 2 }</span>) reduce the need, but fluent builders are still idiomatic for immutable types and validation, just like Java."},
  ],
  exercises:[
    {h3:'When is it worth it?', prompt:"For a class with two required fields and no options, is a Builder a good idea?",
     hint:"Usually no — a plain constructor (or a record) is clearer. Builders pay off when there are <b>many fields, several optional</b>, when you want an immutable result, or when construction needs validation. Don’t add ceremony you don’t need."},
    {h3:'Telescoping constructors', prompt:"What problem with “telescoping constructors” (many overloads) does the Builder solve?",
     hint:"Overloads like <span class='key'>Burger(int)</span>, <span class='key'>Burger(int,bool)</span>, <span class='key'>Burger(int,bool,bool)</span> explode combinatorially and make call sites cryptic (which arg is which?). The Builder names each part and handles any subset of options readably."},
  ],
};

// ───────────────────────── 37 Adapter ─────────────────────────
MODS['37'] = {
  num:'37', slug:'adapter', title:'Adapter', navShort:'Adapter', track:T6,
  heroTitle:'Make incompatible parts <span class="grad">plug together</span>',
  lede:"Real-world picture: a travel power adapter. Your laptop’s plug doesn’t fit the wall socket in another country, so you slot in an adapter that translates one shape into the other. The Adapter pattern lets a class with the “wrong” interface work where a different one is expected.",
  conceptH2:'A translator between two interfaces',
  conceptHtml:
    "<p>Your code expects one interface (the <em>target</em>); you have an existing class with a different, incompatible interface (the <em>adaptee</em>). Rather than rewrite either, you build an <strong>adapter</strong> that implements the target and forwards each call to the adaptee, translating as needed.</p>"+
    cb('interface UsbC { String data(); }                 // what our app expects\nclass MicroUsbDevice { String legacyData(){ return "bits"; } }  // incompatible\n\nclass MicroToUsbC implements UsbC {                // the adapter\n    private final MicroUsbDevice dev;\n    MicroToUsbC(MicroUsbDevice d){ this.dev = d; }\n    public String data(){ return dev.legacyData(); }   // translate the call\n}\nUsbC port = new MicroToUsbC(new MicroUsbDevice());')+
    "<p>Adapters are how you integrate legacy code, third-party libraries, or two systems that weren’t designed for each other. The JDK’s <span class='key'>Arrays.asList(...)</span> adapts an array to the <span class='key'>List</span> interface; <span class='key'>InputStreamReader</span> adapts a byte stream to a character stream.</p>",
  stages:[{t:'app wants UsbC',s:'target',c:'cyan'},{t:'legacy device',s:'incompatible',c:'coral'},{t:'adapter',s:'implements UsbC',c:'purple'},{t:'translate',s:'forward call',c:'amber'},{t:'works',s:'plug fits',c:'emerald'}],
  stepH2:'Bridge the “wrong” interface',
  stepIntro:'Step through how an adapter lets a device your code can’t talk to suddenly fit right in.',
  steps:[
    {n:0, cap:'Your app speaks UsbC; the device only speaks MicroUsb. They don’t fit.'},
    {n:1, cap:'The <b>target</b> interface your code expects is <span class="key">UsbC</span>.'},
    {n:2, cap:'The existing device (the <b>adaptee</b>) has an incompatible interface.'},
    {n:3, cap:'An <b>adapter</b> implements <span class="key">UsbC</span> and holds the device inside.'},
    {n:4, cap:'Each call is <b>translated/forwarded</b> to the device’s own method.'},
    {n:5, cap:'Incompatible parts now <b>work together</b> — exactly like a travel plug.'},
  ],
  playH2:'A voltage adapter', playFile:'Adapter.java',
  playIntro:'A travel adapter converts a 240V socket to the 120V the device needs. Model the conversion.',
  playCode:'// Adapter converts the wall voltage to what the device expects\nint wallVoltage = 240;\nint deviceNeeds = 120;\nint adapted = wallVoltage / 2;     // the adapter translates\nSystem.out.println("wall socket  = " + wallVoltage + "V");\nSystem.out.println("device wants = " + deviceNeeds + "V");\nSystem.out.println("after adapter = " + adapted + "V, fits? " + (adapted == deviceNeeds));',
  callouts:[
    {lang:'python', body:"Duck typing often removes the need — if your object already has the right method names, it just works. When it doesn’t, you write a small wrapper class that forwards calls, which is the Adapter in spirit."},
    {lang:'js', body:"A thin <b>wrapper object or function</b> that exposes the expected shape and forwards to the real one is the everyday adapter. Same idea as Java, minus the explicit interface declaration."},
    {lang:'csharp', body:"Identical pattern: implement the target interface and delegate to the wrapped object. Extension methods can also retrofit a missing method onto an existing type — a lightweight adapter-like tool."},
  ],
  exercises:[
    {h3:'Adapter vs change the class', prompt:"Why adapt a third-party class instead of just editing it to match your interface?",
     hint:"You often <b>can’t edit it</b> (it’s a library/legacy code), and even if you could, changing it might break other users or get overwritten on upgrade. An adapter leaves the original untouched and isolates the translation in one place."},
    {h3:'Name a JDK adapter', prompt:"<span class='key'>Arrays.asList(myArray)</span> lets you treat an array as a <span class='key'>List</span>. Which roles are the target and the adaptee here?",
     hint:"The <b>target</b> is the <span class='key'>List</span> interface your code wants; the <b>adaptee</b> is the underlying array. The returned object adapts array access to the List API (note it’s fixed-size, since it’s backed by the array)."},
  ],
};

// ───────────────────────── 38 Decorator ─────────────────────────
MODS['38'] = {
  num:'38', slug:'decorator', title:'Decorator', navShort:'Decorator', track:T6,
  heroTitle:'Add extras by <span class="grad">wrapping</span>, not subclassing',
  lede:"Real-world picture: a coffee. Start with a plain cup, then wrap it with milk, then wrap that with whipped cream. Each layer adds to the price and the description. Decorator adds behavior to an object by wrapping it — no explosion of subclasses for every combination.",
  conceptH2:'Same interface, layered behavior',
  conceptHtml:
    "<p>Imagine a subclass for every drink combo: <span class='key'>CoffeeWithMilk</span>, <span class='key'>CoffeeWithMilkAndWhip</span>… it explodes. Instead, a <strong>decorator</strong> implements the same interface as the thing it wraps and adds a little before/after delegating to the inner object. Decorators stack freely.</p>"+
    cb('interface Coffee { int cost(); }\nclass Plain implements Coffee { public int cost(){ return 250; } }\n\nabstract class AddOn implements Coffee {        // decorator base\n    protected final Coffee inner;\n    AddOn(Coffee c){ this.inner = c; }\n}\nclass Milk extends AddOn {\n    Milk(Coffee c){ super(c); }\n    public int cost(){ return inner.cost() + 50; }   // wrap + add\n}\nCoffee order = new Milk(new Plain());          // cost() -> 300')+
    "<p>This is exactly how <span class='key'>java.io</span> works: <span class='key'>new BufferedReader(new InputStreamReader(in))</span> — each wrapper adds a capability. Decorators give you runtime composition (pick layers on the fly) that rigid inheritance can’t.</p>",
  stages:[{t:'Plain coffee',s:'base',c:'cyan'},{t:'Milk wraps it',s:'+50',c:'amber'},{t:'Whip wraps that',s:'+75',c:'purple'},{t:'still a Coffee',s:'same interface',c:'emerald'},{t:'cost()',s:'sums layers',c:'coral'}],
  stepH2:'Stack the add-ons',
  stepIntro:'Step through wrapping a plain coffee in layers, each adding to the cost while keeping the same interface.',
  steps:[
    {n:0, cap:'You want any combination of add-ons without a class for each combo.'},
    {n:1, cap:'Start with a <b>Plain</b> coffee implementing the Coffee interface.'},
    {n:2, cap:'A <b>Milk</b> decorator wraps it and adds 50 to the cost.'},
    {n:3, cap:'A <b>Whip</b> decorator wraps that — decorators <b>stack</b>.'},
    {n:4, cap:'Every wrapper is <b>still a Coffee</b>, so callers treat the stack uniformly.'},
    {n:5, cap:'Calling <span class="key">cost()</span> walks the layers and <b>sums</b> them.'},
  ],
  playH2:'Sum the layers', playFile:'Decorator.java',
  playIntro:'Each decorator adds to the base price (in cents). Model the decorated total.',
  playCode:'// Each add-on wraps the coffee and adds to the price (cents)\nint base = 250;     // plain coffee\nint milk = 50;      // + milk decorator\nint whip = 75;      // + whip decorator\nint total = base + milk + whip;\nSystem.out.println("coffee base     = " + base);\nSystem.out.println("+ milk + whip   = " + (milk + whip));\nSystem.out.println("decorated total = " + total);',
  callouts:[
    {lang:'python', body:"Careful: Python’s <span class='key'>@decorator</span> syntax decorates <em>functions</em>, a related but different idea. For objects, you wrap one object in another that forwards calls — the GoF Decorator. Both share the “wrap to extend” spirit."},
    {lang:'js', body:"Higher-order functions and wrappers are the everyday decorator (e.g. wrapping a handler with logging). React’s higher-order components are a UI flavor of the same wrap-to-extend idea."},
    {lang:'go', body:"Go composes via <b>embedding</b> and wrapper structs that satisfy the same interface — middleware (<span class='key'>http.Handler</span> wrapping a handler) is decorator by another name."},
  ],
  exercises:[
    {h3:'Why not subclasses?', prompt:"With 4 optional add-ons, how many subclasses would “one class per combination” need, and why is that bad?",
     hint:"Up to 2⁴ = <b>16</b> combinations — it explodes combinatorially and can’t be chosen at runtime. Decorators compose the same 4 small wrappers in any order, picking layers dynamically."},
    {h3:'Spot it in java.io', prompt:"In <span class='key'>new BufferedReader(new InputStreamReader(in))</span>, what does each wrapper add?",
     hint:"<span class='key'>InputStreamReader</span> decorates a byte stream to produce characters; <span class='key'>BufferedReader</span> decorates that to add buffering and <span class='key'>readLine()</span>. Each layer is a decorator adding one capability over the same stream interface."},
  ],
};

// ───────────────────────── 39 Facade ─────────────────────────
MODS['39'] = {
  num:'39', slug:'facade', title:'Facade', navShort:'Facade', track:T6,
  heroTitle:'One simple button over a <span class="grad">complex machine</span>',
  lede:"Real-world picture: a “watch movie” button on a universal remote. Behind that one press, the lights dim, the screen lowers, the projector warms up, the sound switches to surround, and streaming starts. A Facade gives a simple front door to a complicated subsystem.",
  conceptH2:'A friendly interface hiding many moving parts',
  conceptHtml:
    "<p>When using a feature means orchestrating five classes in the right order, callers shouldn’t have to know that dance. A <strong>Facade</strong> is a single class that exposes a simple method and coordinates the messy subsystem behind it. It doesn’t add new behavior — it simplifies access.</p>"+
    cb('class HomeTheaterFacade {\n    // wraps Lights, Screen, Projector, Sound, Streaming\n    void watchMovie(String title) {\n        lights.dim(30);\n        screen.down();\n        projector.on();\n        sound.setMode("surround");\n        streaming.play(title);\n    }\n}\nfacade.watchMovie("Dune");   // one call orchestrates the whole subsystem')+
    "<p>Facades keep callers decoupled from subsystem details, so you can rework the internals without touching client code. Most Spring <span class='key'>...Service</span> classes are facades over repositories, validators, and mappers; <span class='key'>javax</span>’s <span class='key'>Files</span> is a facade over the file-system APIs.</p>",
  stages:[{t:'watchMovie()',s:'one call',c:'cyan'},{t:'lights.dim()',s:'subsystem',c:'amber'},{t:'projector.on()',s:'subsystem',c:'purple'},{t:'sound.surround()',s:'subsystem',c:'emerald'},{t:'orchestrated',s:'hidden',c:'coral'}],
  stepH2:'One press, many steps',
  stepIntro:'Step through what a single facade call quietly does on your behalf.',
  steps:[
    {n:0, cap:'A home theater has many fiddly subsystems, each with its own API.'},
    {n:1, cap:'The facade exposes one simple <span class="key">watchMovie()</span> call.'},
    {n:2, cap:'Behind it, the facade <b>dims the lights</b>.'},
    {n:3, cap:'It lowers the screen and <b>turns on the projector</b>.'},
    {n:4, cap:'It sets <b>surround sound</b> and starts streaming.'},
    {n:5, cap:'You pressed one button; the facade <b>orchestrated</b> the whole subsystem.'},
  ],
  playH2:'Complexity hidden', playFile:'Facade.java',
  playIntro:'One call stands in for many subsystem steps. Model how much the facade hides.',
  playCode:'// watchMovie() hides many subsystem steps behind one call\nint subsystemSteps = 5;   // dim, lower screen, projector, sound, stream\nint callsYouMake   = 1;   // you press one button\nSystem.out.println("subsystem steps = " + subsystemSteps);\nSystem.out.println("calls you make  = " + callsYouMake);\nSystem.out.println("complexity hidden? " + (callsYouMake < subsystemSteps));',
  callouts:[
    {lang:'python', body:"A <b>module</b> that exposes a couple of clean functions over a tangle of internal helpers is a facade. You import <span class='key'>requests</span> and call <span class='key'>get()</span> — a facade over sockets, TLS, pooling, and encoding."},
    {lang:'js', body:"A module exporting one simple <span class='key'>doTheThing()</span> over several internal pieces is the same pattern. <span class='key'>fetch()</span> is a facade over the lower-level networking machinery."},
    {lang:'csharp', body:"Service classes and SDK clients (e.g. an <span class='key'>HttpClient</span> wrapper) are facades over subsystems — identical intent. The difference from Java is only naming and packaging."},
  ],
  exercises:[
    {h3:'Facade vs Adapter', prompt:"Both wrap other code. What’s the core difference in intent between a Facade and an Adapter?",
     hint:"An <b>Adapter</b> changes an interface to match what a caller expects (compatibility). A <b>Facade</b> simplifies access to a whole subsystem (convenience) — it usually wraps many classes behind one easy method, not one class behind a matching interface."},
    {h3:'Does it limit power?', prompt:"If the facade only exposes <span class='key'>watchMovie()</span>, can advanced users still control individual components?",
     hint:"Yes — a facade is a convenience layer, not a wall. The subsystem classes typically remain accessible for power users who need fine control; the facade just covers the common case simply."},
  ],
};

// ───────────────────────── 40 Proxy ─────────────────────────
MODS['40'] = {
  num:'40', slug:'proxy', title:'Proxy', navShort:'Proxy', track:T6,
  heroTitle:'A <span class="grad">stand-in</span> that controls access',
  lede:"Real-world picture: a debit card stands in for the cash in your bank account. It looks and acts like access to your money, but it can check your PIN, enforce limits, and only reaches the real account when needed. A Proxy is a placeholder that controls access to another object.",
  conceptH2:'Same interface, with a gatekeeper in front',
  conceptHtml:
    "<p>A <strong>proxy</strong> implements the same interface as the real object and holds a reference to it (or creates it on demand). Callers think they’re talking to the real thing, but the proxy can add access control, caching, logging, or — very commonly — <em>lazy loading</em> of an expensive object.</p>"+
    cb('interface Image { void display(); }\nclass RealImage implements Image {        // heavy: loads from disk\n    RealImage(String f){ loadFromDisk(f); }\n    public void display(){ /* draw */ }\n}\nclass ImageProxy implements Image {       // lightweight stand-in\n    private RealImage real; private final String file;\n    ImageProxy(String f){ this.file = f; }\n    public void display(){\n        if (real == null) real = new RealImage(file);  // lazy-load on first use\n        real.display();\n    }\n}')+
    "<p>Java leans on proxies heavily: Hibernate returns proxies for lazy entity loading, Spring wraps beans in proxies to add transactions and security, and <span class='key'>java.lang.reflect.Proxy</span> builds them at runtime. The client code never changes — the proxy slips in transparently.</p>",
  stages:[{t:'client',s:'asks Image',c:'cyan'},{t:'proxy',s:'stand-in',c:'purple'},{t:'check / defer',s:'control access',c:'amber'},{t:'real object',s:'made on demand',c:'coral'},{t:'forward',s:'display()',c:'emerald'}],
  stepH2:'Lazy-load through a stand-in',
  stepIntro:'Step through how a proxy delays creating an expensive object until it’s actually needed.',
  steps:[
    {n:0, cap:'The real image is heavy to load, and you might never display it.'},
    {n:1, cap:'The client talks to a <b>proxy</b> that implements the same <span class="key">Image</span> interface.'},
    {n:2, cap:'The proxy can <b>guard access</b> or defer work — the client can’t tell.'},
    {n:3, cap:'Only on the <b>first real use</b> does it create the heavy RealImage (lazy load).'},
    {n:4, cap:'The <b>real object</b> is constructed on demand, once.'},
    {n:5, cap:'The proxy <b>forwards</b> the call — transparent to the caller.'},
  ],
  playH2:'Pay the cost only on access', playFile:'Proxy.java',
  playIntro:'A virtual proxy shows a cheap placeholder and loads the heavy object only when viewed. Model the costs.',
  playCode:'// Virtual proxy: heavy load happens only on real access\nint placeholderCost = 1;     // cheap stand-in shown immediately\nint realImageCost   = 500;   // loaded lazily, only when viewed\nint costBeforeView = placeholderCost;\nSystem.out.println("cost before view = " + costBeforeView);\nSystem.out.println("full cost on access = " + (placeholderCost + realImageCost));\nSystem.out.println("saved by not loading early? " + (costBeforeView < realImageCost));',
  callouts:[
    {lang:'python', body:"<span class='key'>__getattr__</span> and descriptors let an object impersonate another and intercept access — a natural proxy. <span class='key'>@property</span> lazily computes a value much like a virtual proxy defers loading."},
    {lang:'js', body:"JS has a built-in <span class='key'>Proxy</span> object that intercepts property access and method calls — the pattern is a language feature. Java builds proxies via interfaces or <span class='key'>reflect.Proxy</span> at runtime."},
    {lang:'csharp', body:"<span class='key'>DispatchProxy</span> and libraries like Castle DynamicProxy create runtime proxies; EF and DI frameworks use them for lazy loading and interception, mirroring Hibernate/Spring in Java."},
  ],
  exercises:[
    {h3:'Proxy vs Decorator', prompt:"Both wrap an object with the same interface. How does a Proxy differ in intent from a Decorator?",
     hint:"A <b>Decorator</b> adds new behavior/features to the object. A <b>Proxy</b> controls <em>access</em> to it — lazy loading, permissions, caching, remoting — usually without changing what the object does. Same shape, different purpose."},
    {h3:'Where would it help?', prompt:"A page shows 100 high-res images but users scroll past most. How does a virtual proxy help?",
     hint:"Each image is a proxy that holds only the file path and a placeholder. The heavy bytes load <b>lazily</b> when an image actually scrolls into view, so you never pay to load the ones nobody sees."},
  ],
};

// ───────────────────────── 41 Strategy ─────────────────────────
MODS['41'] = {
  num:'41', slug:'strategy', title:'Strategy', navShort:'Strategy', track:T6,
  heroTitle:'Swap the <span class="grad">algorithm</span> at runtime',
  lede:"Real-world picture: a maps app planning the same trip. Tap “drive,” “bike,” or “walk” and it runs a different routing algorithm — but the app around it doesn’t change. Strategy defines a family of interchangeable algorithms and lets you pick one at runtime.",
  conceptH2:'Algorithms behind a common interface',
  conceptHtml:
    "<p>When you find a big <span class='key'>switch</span> choosing between behaviors, Strategy is usually the fix. Each behavior becomes a class implementing a shared interface; the context holds one and delegates to it. Swapping behavior is now a setter call, not an edit.</p>"+
    cb('interface Route { int minutes(int km); }\nclass ByCar  implements Route { public int minutes(int km){ return km * 1; } }\nclass ByBike implements Route { public int minutes(int km){ return km * 4; } }\n\nclass Navigator {\n    private Route strategy;\n    void use(Route r){ this.strategy = r; }   // swap at runtime\n    int eta(int km){ return strategy.minutes(km); }\n}')+
    "<p>Because Java lambdas <em>are</em> implementations of single-method interfaces, Strategy often collapses to passing a function: <span class='key'>list.sort(Comparator.comparing(User::age))</span> passes a sorting strategy. It’s the runtime-flexible cousin of polymorphism, and it powers pricing rules, validators, and compression choices everywhere.</p>",
  stages:[{t:'Navigator',s:'context',c:'cyan'},{t:'Route',s:'strategy interface',c:'purple'},{t:'ByCar / ByBike',s:'algorithms',c:'amber'},{t:'use(strategy)',s:'swap at runtime',c:'emerald'},{t:'eta()',s:'delegates',c:'coral'}],
  stepH2:'Pick a route algorithm on the fly',
  stepIntro:'Step through how the same context produces different results by swapping its strategy object.',
  steps:[
    {n:0, cap:'The same trip can be routed many ways — don’t hardcode one.'},
    {n:1, cap:'The <b>Navigator</b> (context) holds a Route strategy.'},
    {n:2, cap:'<b>Route</b> is the interface each algorithm implements.'},
    {n:3, cap:'<b>ByCar, ByBike, ByWalk</b> are interchangeable strategy implementations.'},
    {n:4, cap:'<span class="key">use(...)</span> <b>swaps the algorithm</b> at runtime.'},
    {n:5, cap:'<span class="key">eta()</span> just <b>delegates</b> to whichever strategy is set.'},
  ],
  playH2:'Compare strategies', playFile:'Strategy.java',
  playIntro:'Three routing strategies give three ETAs for the same trip. Model picking one.',
  playCode:'// Same trip, swappable route strategies (minutes)\nint byCar  = 20;\nint byBike = 35;\nint byWalk = 75;\nint chosen = byCar;     // pick a strategy at runtime\nSystem.out.println("car/bike/walk = " + byCar + "/" + byBike + "/" + byWalk);\nSystem.out.println("chosen strategy = " + chosen + " min");\nSystem.out.println("car faster than walking? " + (byCar < byWalk));',
  callouts:[
    {lang:'python', body:"Functions are first-class, so a strategy is usually just a function you pass in: <span class='key'>sorted(items, key=by_age)</span>. Java reaches the same place with lambdas, which are shorthand for single-method strategy interfaces."},
    {lang:'js', body:"Pass a <b>callback</b> — <span class='key'>arr.sort((a,b) =&gt; a.age - b.age)</span> — and you’ve used Strategy. Java’s <span class='key'>Comparator</span> lambdas are the exact analog."},
    {lang:'csharp', body:"<span class='key'>Func&lt;&gt;</span>/<span class='key'>Action&lt;&gt;</span> delegates are strategies passed as values, just like Java lambdas. LINQ’s <span class='key'>OrderBy(keySelector)</span> is Strategy in action."},
  ],
  exercises:[
    {h3:'Refactor the switch', prompt:"You see <span class='key'>switch(type){ case CARD: ...; case PAYPAL: ...; }</span> for payments. How does Strategy improve it?",
     hint:"Make a <span class='key'>PaymentStrategy</span> interface with one implementation per method; the context holds and calls one. Adding a payment type means adding a class, not editing the switch (also satisfies Open/Closed from module 12)."},
    {h3:'Lambda or class?', prompt:"When is a full Strategy class better than passing a lambda?",
     hint:"A lambda is perfect for a small, stateless one-off. Prefer a named class when the strategy has <b>state/config</b>, needs a <b>good name</b>, is <b>reused</b> in many places, or is complex enough to test on its own."},
  ],
};

// ───────────────────────── 42 Observer ─────────────────────────
MODS['42'] = {
  num:'42', slug:'observer', title:'Observer', navShort:'Observer', track:T6,
  heroTitle:'Notify all the <span class="grad">subscribers</span>',
  lede:"Real-world picture: subscribing to a YouTube channel. When the creator posts a new video, every subscriber gets notified automatically — the creator doesn’t call each person. Observer lets one object (the subject) broadcast changes to many dependents without knowing who they are.",
  conceptH2:'Publish once, many react',
  conceptHtml:
    "<p>The <strong>subject</strong> keeps a list of <strong>observers</strong> and, when something happens, loops over them and calls a notify method. Observers register and unregister themselves. The subject depends only on a small interface, so it never needs to know the concrete subscribers — that’s loose coupling.</p>"+
    cb('interface Subscriber { void onNewVideo(String title); }\nclass Channel {\n    private final List<Subscriber> subs = new ArrayList<>();\n    void subscribe(Subscriber s){ subs.add(s); }\n    void unsubscribe(Subscriber s){ subs.remove(s); }\n    void upload(String title) {\n        for (Subscriber s : subs) s.onNewVideo(title);   // notify all\n    }\n}')+
    "<p>This is the engine behind event systems and UIs: <span class='key'>button.addActionListener(...)</span>, <span class='key'>PropertyChangeListener</span>, and reactive libraries are all Observer. It decouples producers from consumers — but watch for memory leaks if observers forget to unsubscribe, and beware notification storms.</p>",
  stages:[{t:'subscribe()',s:'register',c:'cyan'},{t:'Channel',s:'the subject',c:'purple'},{t:'upload()',s:'event fires',c:'amber'},{t:'notify all',s:'loop subs',c:'emerald'},{t:'onNewVideo()',s:'each reacts',c:'coral'}],
  stepH2:'Broadcast to everyone watching',
  stepIntro:'Step through how one event reaches every subscriber without the subject knowing who they are.',
  steps:[
    {n:0, cap:'Many subscribers want to know the moment a channel posts.'},
    {n:1, cap:'Subscribers <b>register</b> themselves via <span class="key">subscribe()</span>.'},
    {n:2, cap:'The <b>Channel</b> (subject) keeps the list of subscribers.'},
    {n:3, cap:'<span class="key">upload()</span> is the <b>event</b> that fires.'},
    {n:4, cap:'The channel <b>notifies every subscriber</b> in turn — it only knows the interface.'},
    {n:5, cap:'Each subscriber <b>reacts</b> in its own <span class="key">onNewVideo()</span> — loosely coupled.'},
  ],
  playH2:'Count the notifications', playFile:'Observer.java',
  playIntro:'A new upload notifies every subscriber. Model how many notifications go out.',
  playCode:'// A channel notifies all its subscribers on a new video\nint subscribers = 3;\nint newVideos   = 1;\nint notifications = subscribers * newVideos;\nSystem.out.println("subscribers = " + subscribers);\nSystem.out.println("new video -> notifications = " + notifications);\nSystem.out.println("everyone notified? " + (notifications == subscribers));',
  callouts:[
    {lang:'python', body:"Often just a list of callables you invoke on change, or libraries like <span class='key'>blinker</span>. The pattern is the same: keep subscribers, call them on an event. Java formalizes it with a listener interface."},
    {lang:'js', body:"Observer is built into the language and DOM: <span class='key'>addEventListener</span>, Node’s <span class='key'>EventEmitter</span>, and reactive streams (RxJS) are all this pattern. Java’s listeners are the direct analog."},
    {lang:'csharp', body:"C# bakes it in with <span class='key'>event</span>/<span class='key'>delegate</span> and <span class='key'>IObservable&lt;T&gt;</span>. <span class='key'>channel.NewVideo += handler;</span> is Observer with language sugar; Java wires listeners explicitly."},
  ],
  exercises:[
    {h3:'Why the interface?', prompt:"Why does the Channel depend on a <span class='key'>Subscriber</span> interface instead of concrete subscriber classes?",
     hint:"So the subject is <b>decoupled</b> from who’s listening — any class implementing the interface can subscribe, and you can add new subscriber types without touching the Channel. That loose coupling is the whole point."},
    {h3:'The leak', prompt:"A long-lived subject holds subscribers that are short-lived UI objects. What bug can appear, and the fix?",
     hint:"A <b>memory leak</b>: the subject’s list keeps references alive, so subscribers (and what they hold) are never garbage-collected. Fix by <b>unsubscribing</b> when the observer is done (or using weak references)."},
  ],
};

// ───────────────────────── 43 Command ─────────────────────────
MODS['43'] = {
  num:'43', slug:'command', title:'Command', navShort:'Command', track:T6,
  heroTitle:'Wrap a request as an <span class="grad">object</span>',
  lede:"Real-world picture: a restaurant order ticket. The waiter writes your request on a slip and hangs it in the kitchen. The slip is a thing — it can be queued, reordered, and even cancelled. Command turns an action into an object you can store, pass around, queue, log, and undo.",
  conceptH2:'An action you can hold in your hand',
  conceptHtml:
    "<p>Normally a method call vanishes the instant it runs. Wrap it in a <strong>Command</strong> object — with an <span class='key'>execute()</span> (and often <span class='key'>undo()</span>) — and the action becomes data you can keep. An <em>invoker</em> (a button, a queue, a scheduler) runs commands without knowing what they do.</p>"+
    cb('interface Command { void execute(); void undo(); }\nclass InsertText implements Command {\n    private final Document doc; private final String text;\n    InsertText(Document d, String t){ doc = d; text = t; }\n    public void execute(){ doc.append(text); }\n    public void undo(){ doc.deleteLast(text.length()); }   // reversible\n}\n// Push executed commands on a stack -> pop+undo gives you Ctrl+Z')+
    "<p>Command powers undo/redo, task queues, macro recording, and GUI buttons/menu items that trigger the same action. Because a command captures everything it needs, you can run it now, later, on another thread, or replay a whole history.</p>",
  stages:[{t:'Command obj',s:'a request',c:'cyan'},{t:'execute()',s:'do it',c:'emerald'},{t:'undo()',s:'reverse it',c:'amber'},{t:'queue / log',s:'store as data',c:'purple'},{t:'invoker',s:'runs them',c:'coral'}],
  stepH2:'From a call to a reversible object',
  stepIntro:'Step through why turning an action into an object unlocks queues, logging, and undo.',
  steps:[
    {n:0, cap:'You want to queue, log, and undo actions — hard with bare method calls.'},
    {n:1, cap:'Wrap each request as a <b>Command object</b>.'},
    {n:2, cap:'<span class="key">execute()</span> <b>performs</b> the action.'},
    {n:3, cap:'<span class="key">undo()</span> <b>reverses</b> it — possible because the object captured what it changed.'},
    {n:4, cap:'Commands can be <b>queued or logged</b> like ordinary data.'},
    {n:5, cap:'An <b>invoker</b> (a button, a scheduler) runs them without knowing their details.'},
  ],
  playH2:'Execute and undo', playFile:'Command.java',
  playIntro:'Each action is an object, so undo just reverses the last one. Model the effective count.',
  playCode:'// Each action is a command object you can queue and undo\nint executed = 3;     // type, type, delete\nint undos    = 1;\nint effective = executed - undos;\nSystem.out.println("commands executed = " + executed);\nSystem.out.println("after 1 undo      = " + effective);\nSystem.out.println("undo works because each command is an object.");',
  callouts:[
    {lang:'python', body:"A callable (or <span class='key'>functools.partial</span>) captures an action and its arguments — a lightweight command. For undo you still store paired do/undo callables, which is the same idea with less ceremony."},
    {lang:'js', body:"Functions and closures are commands you can push onto an undo stack. Redux <b>actions</b> are command-like objects describing “what happened,” enabling logging and time-travel debugging."},
    {lang:'csharp', body:"WPF/MVVM has a first-class <span class='key'>ICommand</span> interface for buttons and menus — the pattern is built into the UI framework. <span class='key'>Action</span> delegates serve as lightweight commands too."},
  ],
  exercises:[
    {h3:'What enables undo?', prompt:"Why can a Command implement <span class='key'>undo()</span> when a plain method call can’t be “taken back”?",
     hint:"The command object <b>captures the state/inputs</b> needed to reverse itself (e.g. what text it inserted and where). A bare call leaves nothing behind to reverse; the object persists that information."},
    {h3:'One action, two buttons', prompt:"A toolbar button and a menu item should both “Save.” How does Command avoid duplicating logic?",
     hint:"Both invokers hold the <b>same SaveCommand</b> object and call <span class='key'>execute()</span>. The action lives in one place; the button and menu are just different invokers triggering it."},
  ],
};

// ───────────────────────── 44 Template Method ─────────────────────────
MODS['44'] = {
  num:'44', slug:'template-method', title:'Template Method', navShort:'Template Method', track:T6,
  heroTitle:'A fixed recipe with <span class="grad">one step you fill in</span>',
  lede:"Real-world picture: making a hot drink. Boil water, add the main ingredient, pour, serve — the steps and their order are fixed, but “add the main ingredient” differs for tea vs coffee. Template Method puts the skeleton of an algorithm in a base class and lets subclasses fill in specific steps.",
  conceptH2:'The base class owns the structure',
  conceptHtml:
    "<p>A <strong>template method</strong> is a <span class='key'>final</span> method in an abstract class that calls a fixed sequence of steps. Some steps are implemented in the base; others are <span class='key'>abstract</span> hooks the subclasses must supply. Subclasses customize <em>what</em> happens at each step but can’t change the overall <em>order</em>.</p>"+
    cb('abstract class HotDrink {\n    final void make() {          // the template: fixed order, can\\u2019t override\n        boilWater();\n        addMainIngredient();     // the step subclasses fill in\n        pourIntoCup();\n    }\n    private void boilWater(){ /* shared */ }\n    private void pourIntoCup(){ /* shared */ }\n    protected abstract void addMainIngredient();   // the hook\n}\nclass Tea extends HotDrink { protected void addMainIngredient(){ steepTeaBag(); } }')+
    "<p>It’s the inheritance-based counterpart to Strategy: instead of injecting a behavior object, you subclass and override a hook. The JDK uses it in <span class='key'>AbstractList</span> (implement <span class='key'>get</span>/<span class='key'>size</span>, inherit the rest) and servlet <span class='key'>HttpServlet</span> (override <span class='key'>doGet</span>/<span class='key'>doPost</span>).</p>",
  stages:[{t:'make()',s:'skeleton',c:'cyan'},{t:'boilWater()',s:'fixed step',c:'emerald'},{t:'addIngredient()',s:'abstract hook',c:'amber'},{t:'subclass fills',s:'Tea / Coffee',c:'purple'},{t:'pour()',s:'fixed step',c:'coral'}],
  stepH2:'Shared structure, varying steps',
  stepIntro:'Step through how the base class locks the order while subclasses supply the differing step.',
  steps:[
    {n:0, cap:'Several recipes share the same steps in the same order.'},
    {n:1, cap:'A <span class="key">final make()</span> method defines the <b>skeleton</b> — subclasses can’t reorder it.'},
    {n:2, cap:'Some steps are <b>fixed</b> and shared, like <span class="key">boilWater()</span>.'},
    {n:3, cap:'One step is an <b>abstract hook</b>: <span class="key">addMainIngredient()</span>.'},
    {n:4, cap:'Each <b>subclass fills in</b> only that step (Tea steeps; Coffee brews).'},
    {n:5, cap:'<span class="key">pourIntoCup()</span> finishes — structure shared, details vary.'},
  ],
  playH2:'Fixed plus custom steps', playFile:'Template.java',
  playIntro:'The skeleton contributes fixed steps; the subclass adds its one custom step. Model the totals.',
  playCode:'// Template method: fixed skeleton steps + one step the subclass varies\nint fixedSteps  = 3;     // boil, pour, serve (same for all drinks)\nint customSteps = 1;     // the ingredient step that varies\nint totalSteps = fixedSteps + customSteps;\nSystem.out.println("fixed skeleton steps  = " + fixedSteps);\nSystem.out.println("subclass custom steps = " + customSteps);\nSystem.out.println("total run steps = " + totalSteps);',
  callouts:[
    {lang:'python', body:"Same approach: a base class with a concrete method that calls <span class='key'>NotImplementedError</span> hooks (or <span class='key'>abc.abstractmethod</span>) which subclasses override. Python’s duck typing makes the hooks less formal but the structure identical."},
    {lang:'js', body:"A base class method that calls overridable methods on <span class='key'>this</span> achieves it; subclasses override the hook. Without abstract keywords you enforce hooks by convention or by throwing in the base."},
    {lang:'csharp', body:"Mark the template <span class='key'>sealed</span> and the hooks <span class='key'>abstract</span>/<span class='key'>virtual</span> — a near-exact mapping of Java’s <span class='key'>final</span> template + <span class='key'>abstract</span> steps."},
  ],
  exercises:[
    {h3:'Why final?', prompt:"Why is the template method itself usually <span class='key'>final</span> (non-overridable)?",
     hint:"To protect the <b>invariant order</b> of steps. The whole point is that subclasses customize individual steps, not rearrange or skip them. Making the template final stops a subclass from breaking the algorithm’s structure."},
    {h3:'Template vs Strategy', prompt:"Both let behavior vary. When would you pick Strategy over Template Method?",
     hint:"Template Method varies steps via <b>inheritance</b> (compile-time, one subclass per variant). Strategy varies the whole algorithm via <b>composition</b> (swap an object at runtime). Prefer Strategy when you need runtime flexibility or want to avoid subclassing."},
  ],
};

// ───────────────────────── 45 State ─────────────────────────
MODS['45'] = {
  num:'45', slug:'state', title:'State', navShort:'State', track:T6,
  heroTitle:'Behavior that <span class="grad">changes with the mode</span>',
  lede:"Real-world picture: a traffic light. Green lets you go, yellow says slow down, red stops you — the same light behaves completely differently depending on its current state, and it follows fixed transitions. The State pattern lets an object change its behavior when its internal state changes, as if it changed class.",
  conceptH2:'Each state is its own object',
  conceptHtml:
    "<p>The naive version is a giant <span class='key'>switch(status)</span> repeated in every method — brittle and sprawling. The <strong>State</strong> pattern makes each state a class implementing a shared interface; the context delegates behavior to its current state object, and states decide the transitions.</p>"+
    cb('interface LightState { LightState next(); }\nclass Green  implements LightState { public LightState next(){ return new Yellow(); } }\nclass Yellow implements LightState { public LightState next(){ return new Red(); } }\nclass Red    implements LightState { public LightState next(){ return new Green(); } }\n\nclass TrafficLight {\n    private LightState state = new Green();\n    void change(){ state = state.next(); }   // behavior + transition delegated\n}')+
    "<p>State turns tangled conditionals into small, focused classes and makes the legal transitions explicit. You’ll meet it in workflow engines (draft → review → published), vending machines, TCP connection states, and game character modes.</p>",
  stages:[{t:'TrafficLight',s:'context',c:'cyan'},{t:'state field',s:'current state',c:'purple'},{t:'Green/Yellow/Red',s:'state classes',c:'amber'},{t:'change()',s:'delegates',c:'emerald'},{t:'next state',s:'transition',c:'coral'}],
  stepH2:'Same object, shifting behavior',
  stepIntro:'Step through how delegating to a state object replaces a sprawling status switch.',
  steps:[
    {n:0, cap:'An object should behave differently depending on its mode.'},
    {n:1, cap:'The <b>TrafficLight</b> (context) holds a current state object.'},
    {n:2, cap:'Each state — <b>Green, Yellow, Red</b> — is its own class.'},
    {n:3, cap:'Behavior is <b>delegated</b> to whichever state is current.'},
    {n:4, cap:'<span class="key">change()</span> asks the state for the <b>next</b> one.'},
    {n:5, cap:'The object <b>transitions</b> — no giant if/else on a status flag.'},
  ],
  playH2:'A traffic light cycle', playFile:'State.java',
  playIntro:'Each state has its own duration; together they form one cycle. Model the totals.',
  playCode:'// Each state behaves differently (durations in seconds)\nint greenTime  = 30;\nint yellowTime = 5;\nint redTime    = 25;\nint fullCycle = greenTime + yellowTime + redTime;\nSystem.out.println("green/yellow/red = " + greenTime + "/" + yellowTime + "/" + redTime);\nSystem.out.println("full cycle = " + fullCycle + "s");\nSystem.out.println("same object, behavior set by its state.");',
  callouts:[
    {lang:'python', body:"Often done by swapping a state object, or with a dict mapping state → handler function. Enums plus a transition table are a common lightweight version; the OO State pattern is the same idea as classes."},
    {lang:'js', body:"Finite-state-machine libraries (e.g. XState) formalize this, but a plain object whose methods are swapped per state captures it. Replaces the dreaded <span class='key'>switch(status)</span> sprawl just like in Java."},
    {lang:'csharp', body:"Identical pattern — a state interface with one class per state and a context that delegates. Workflow and game frameworks in .NET use it heavily, same as Java’s workflow engines."},
  ],
  exercises:[
    {h3:'What smell does it fix?', prompt:"You see the same <span class='key'>switch(status)</span> copy-pasted across five methods. Why is State a good remedy?",
     hint:"That duplicated conditional is the smell. State moves each branch into its own class, so behavior for a status lives in one place and the methods just delegate. Adding a status becomes adding a class, not editing five switches."},
    {h3:'State vs Strategy', prompt:"State and Strategy have the same class diagram. What’s the key difference in how the object changes?",
     hint:"In <b>Strategy</b>, the client picks the algorithm and it usually stays put. In <b>State</b>, the object <b>transitions itself</b> between states over time (often the states decide the next state), changing its own behavior as it runs."},
  ],
};

module.exports = { MODS };
