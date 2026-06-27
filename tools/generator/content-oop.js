// content-oop.js — the 5 inserted OOP modules (08–12). Merged into content.js's CONTENT.
const attrEsc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const cb = src => '<pre class="code" data-src="'+attrEsc(src)+'"></pre>';
const T2 = 'Track 2: The Language';
const MODS = {};

// ───────────────────────── 08 Encapsulation & Immutability ─────────────────────────
MODS['08'] = {
  num:'08', slug:'encapsulation', title:'Encapsulation & Immutability', navShort:'Encapsulation', track:T2,
  heroTitle:'Hide the data, <span class="grad">expose the behavior</span>',
  lede:"Encapsulation is the pillar most people under-use. It isn't just “make fields private” — it's giving a class control over its own state so it can guarantee its invariants. Push it further and you get immutability: objects that can never be in a wrong state.",
  conceptH2:'A class should guard its own invariants',
  conceptHtml:
    "<p>Make fields <span class='key'>private</span> and let the class mediate every change through methods. That way a single place enforces the rules — a balance that can’t go negative, an email that must contain <span class='key'>@</span>. Callers get behavior, not raw access.</p>"+
    cb('class Account {\n    private int balance;                    // hidden state\n    void deposit(int amt) {\n        if (amt <= 0) throw new IllegalArgumentException();\n        balance += amt;                     // invariant enforced here\n    }\n    int balance() { return balance; }       // read-only view\n}')+
    "<p><strong>Immutability</strong> takes this to its conclusion: make every field <span class='key'>final</span>, set it once in the constructor, and expose no setters. An immutable object is always valid, freely shareable across threads, and safe as a <span class='key'>Map</span> key. When a constructor would take many fields, a <strong>builder</strong> keeps construction readable while still producing an immutable result.</p>"+
    cb('final class Money {\n    private final long cents;                // set once, never changes\n    Money(long cents) { this.cents = cents; }\n    Money plus(Money m) { return new Money(cents + m.cents); } // returns NEW\n}'),
  stages:[{t:'private field',s:'hidden state',c:'coral'},{t:'public method',s:'guarded access',c:'cyan'},{t:'validate',s:'enforce invariant',c:'amber'},{t:'final fields',s:'immutable',c:'emerald'},{t:'builder',s:'construct safely',c:'purple'}],
  stepH2:'From exposed field to bulletproof object',
  stepIntro:'Step through how encapsulation tightens, ending at an immutable object that can never hold an invalid state.',
  steps:[
    {n:0, cap:'We start with a class that has some state to protect.'},
    {n:1, cap:'The field is made <b>private</b> — no outside code can poke it directly.'},
    {n:2, cap:'A <b>public method</b> becomes the only door in, so the class controls every change.'},
    {n:3, cap:'That method <b>validates</b>, enforcing the invariant (e.g. balance never negative) in one place.'},
    {n:4, cap:'Make the fields <b>final</b> and drop setters — now the object is <b>immutable</b> and always valid.'},
    {n:5, cap:'For many fields, a <b>builder</b> keeps construction readable while still yielding an immutable object.'},
  ],
  playH2:'A guarded setter in action', playFile:'Encapsulation.java',
  playIntro:'A setter exists to enforce a rule. Here the “withdraw” guard rejects an overdraft, leaving state unchanged.',
  playCode:'// The invariant a setter would enforce: balance never goes negative\nint balance = 100;\nint withdrawal = 130;\nboolean allowed = withdrawal <= balance;\nSystem.out.println("balance = " + balance);\nSystem.out.println("withdraw " + withdrawal + " allowed? " + allowed);\nSystem.out.println("balance after (rejected) = " + balance);',
  callouts:[
    {lang:'python', body:"Python has no real <span class='key'>private</span> — a leading underscore is a convention and double-underscore only name-mangles. Java’s <span class='key'>private</span> is compiler-enforced, so encapsulation is a guarantee, not a polite request. Python’s <span class='key'>@property</span> ≈ Java getters/setters."},
    {lang:'js', body:"Class <span class='key'>#private</span> fields are recent in JS and runtime-enforced; before them it was closures or convention. Java has had enforced access control from day one, and <span class='key'>final</span> gives true immutability that <span class='key'>Object.freeze</span> only approximates."},
    {lang:'csharp', body:"C# properties (<span class='key'>get; private set;</span>) and <span class='key'>readonly</span>/<span class='key'>init</span> are the direct analogs. Java writes explicit getter methods instead of properties, and uses <span class='key'>final</span> where C# uses <span class='key'>readonly</span>."},
  ],
  exercises:[
    {h3:'Why immutable?', prompt:"Name two concrete benefits of making a small value class (like <span class='key'>Money</span>) immutable.",
     hint:"It’s always valid (no half-updated state), inherently <b>thread-safe</b> (no synchronization needed), and safe to use as a <span class='key'>HashMap</span> key or to share/cache freely — because its hash and value never change."},
    {h3:'Leaky encapsulation', prompt:"A class has a private <span class='key'>List&lt;String&gt;</span> field and a getter that returns it directly. Why is encapsulation broken?",
     hint:"Callers get a reference to the internal list and can mutate it behind the class’s back, bypassing every invariant. Return an unmodifiable view (<span class='key'>List.copyOf(...)</span>) or a copy instead."},
  ],
};

// ───────────────────────── 09 Polymorphism: Overloading vs Overriding ─────────────────────────
MODS['09'] = {
  num:'09', slug:'polymorphism', title:'Polymorphism: Overloading vs Overriding', navShort:'Polymorphism', track:T2,
  heroTitle:'Same name, <span class="grad">resolved two different ways</span>',
  lede:"“Polymorphism” bundles three distinct ideas. Module 06 covered subtype polymorphism (overriding). Here we complete the picture: overloading (resolved by the compiler) versus overriding (resolved at runtime) — and why mixing them up causes subtle bugs.",
  conceptH2:'Three kinds: ad-hoc, subtype, parametric',
  conceptHtml:
    "<p><strong>Overloading</strong> (ad-hoc polymorphism) is many methods with the <em>same name but different parameter lists</em>. The <strong>compiler</strong> picks one based on the <em>static</em> (declared) types of the arguments — it’s decided before the program runs.</p>"+
    cb('void print(int n)    { ... }\nvoid print(String s) { ... }\nprint(42);      // compiler picks print(int)\nprint("hi");    // compiler picks print(String)')+
    "<p><strong>Overriding</strong> (subtype polymorphism) is a subclass replacing an inherited method with the <em>same signature</em>. The <strong>JVM</strong> picks the implementation at <em>runtime</em> based on the object’s actual type (dynamic dispatch). <strong>Generics</strong> are the third kind — parametric polymorphism — one piece of code over many types.</p>"+
    cb('class Animal { String speak() { return "..."; } }\nclass Dog extends Animal { @Override String speak() { return "Woof"; } }\nAnimal a = new Dog();\na.speak();      // runtime picks Dog.speak()  (overriding)')+
    "<p>The trap: overloading is chosen by <em>declared</em> type, overriding by <em>actual</em> type. An <span class='key'>Object</span> reference to a String will pick <span class='key'>print(Object)</span>, not <span class='key'>print(String)</span> — even though it’s really a String.</p>",
  stages:[{t:'method call',s:'same name',c:'cyan'},{t:'overload?',s:'by arg types',c:'amber'},{t:'compile-time',s:'static type',c:'purple'},{t:'override?',s:'by object',c:'emerald'},{t:'runtime',s:'dynamic dispatch',c:'coral'}],
  stepH2:'Who decides which method runs?',
  stepIntro:'Two resolutions happen at two different times. Step through how a name maps to an actual method.',
  steps:[
    {n:0, cap:'You call a method by name — but several could match.'},
    {n:1, cap:'If the name is <b>overloaded</b>, the compiler looks at the <b>argument types</b>.'},
    {n:2, cap:'It picks the overload at <b>compile time</b>, using the <b>static</b> (declared) types — not runtime values.'},
    {n:3, cap:'If the method is <b>overridden</b> in a subclass, that’s decided separately.'},
    {n:4, cap:'At <b>runtime</b>, dynamic dispatch picks the override based on the object’s <b>actual</b> type.'},
    {n:5, cap:'Two questions, two answer-times: overloading = compiler + declared type; overriding = JVM + real object.'},
  ],
  playH2:'Overloading by argument type', playFile:'Polymorphism.java',
  playIntro:"The <span class='key'>+</span> operator is itself overloaded — numeric on ints, concatenation on Strings. Run it to see the same symbol resolve by type.",
  playCode:'// Same +, picked by argument type (like an overloaded method)\nint a = 2;\nint b = 3;\nString x = "2";\nString y = "3";\nSystem.out.println("ints  2 + 3   = " + (a + b));   // numeric -> 5\nSystem.out.println("texts \\"2\\"+\\"3\\" = " + (x + y));  // concat -> 23\nSystem.out.println("Same operator, resolved by type.");',
  callouts:[
    {lang:'python', body:"Python has <b>no</b> overloading by signature — a later <span class='key'>def</span> just replaces the earlier one. You dispatch on type manually or with <span class='key'>functools.singledispatch</span>. Java’s compiler picks among overloads by static argument types."},
    {lang:'js', body:"JS also lacks signature overloading (last definition wins); you branch on <span class='key'>typeof</span>/<span class='key'>arguments</span>. Overriding via the prototype chain is the familiar half; Java adds true compile-time overload resolution."},
    {lang:'csharp', body:"Essentially identical: overloading by parameter list plus <span class='key'>virtual</span>/<span class='key'>override</span> for runtime dispatch. The Java difference is that methods are virtual by default; you opt out with <span class='key'>final</span>."},
  ],
  exercises:[
    {h3:'Declared vs actual', prompt:"With <span class='key'>print(Object)</span> and <span class='key'>print(String)</span> defined, what does <span class='key'>Object o = \"hi\"; print(o);</span> call?",
     hint:"<span class='key'>print(Object)</span>. Overload resolution uses the <b>declared</b> type of <span class='key'>o</span> (Object), decided at compile time — even though the value is really a String. Overriding, by contrast, would use the real type."},
    {h3:'Override or overload?', prompt:"You write <span class='key'>public boolean equals(MyType o)</span> intending to override <span class='key'>Object.equals</span>. Why doesn’t it?",
     hint:"<span class='key'>Object.equals</span> takes an <span class='key'>Object</span> parameter; yours takes <span class='key'>MyType</span>, so it’s a different signature — an <b>overload</b>, not an override. Collections still call <span class='key'>equals(Object)</span>. Use <span class='key'>@Override</span> so the compiler catches this."},
  ],
};

// ───────────────────────── 10 Composition over Inheritance ─────────────────────────
MODS['10'] = {
  num:'10', slug:'composition', title:'Composition over Inheritance', navShort:'Composition', track:T2,
  heroTitle:'Prefer <span class="grad">has-a</span> over is-a',
  lede:"Inheritance is the first tool beginners reach for and the one experts reach for last. “Favor composition over inheritance” is the most repeated design advice in Java for a reason: a field you delegate to is far more flexible than a base class you’re welded to.",
  conceptH2:'is-a couples you; has-a frees you',
  conceptHtml:
    "<p><strong>Inheritance</strong> models <em>is-a</em>: a <span class='key'>Dog</span> is an <span class='key'>Animal</span>. It’s tight coupling — the subclass depends on the parent’s internals, and a change to the base can silently break it (the “fragile base class” problem). <strong>Composition</strong> models <em>has-a</em>: a class holds another as a field and <strong>delegates</strong> to it.</p>"+
    cb('// Inheritance (is-a) — rigid, exposes Vector’s whole API\nclass Stack<E> extends Vector<E> { ... }   // classic mistake\n\n// Composition (has-a) — hold a field, expose only what you mean to\nclass Stack<E> {\n    private final List<E> items = new ArrayList<>();   // HAS-A list\n    void push(E e) { items.add(e); }                   // delegate\n    E pop() { return items.remove(items.size() - 1); }\n}')+
    "<p>Composition lets you swap the collaborator (inject a different <span class='key'>List</span>), expose a minimal API, and avoid inheriting methods you didn’t want. Reach for inheritance only for a genuine, stable is-a relationship; otherwise hold a field and delegate. (This is also why Go and modern designs drop inheritance entirely.)</p>",
  stages:[{t:'is-a',s:'inheritance',c:'amber'},{t:'fragile base',s:'tight coupling',c:'coral'},{t:'has-a',s:'composition',c:'cyan'},{t:'delegate',s:'forward calls',c:'purple'},{t:'swap impl',s:'flexible',c:'emerald'}],
  stepH2:'Refactor a brittle subclass into a delegate',
  stepIntro:'Watch a class move from extending a base it shouldn’t, to holding one as a field — and gaining flexibility.',
  steps:[
    {n:0, cap:'We need a Stack. The tempting move is to extend an existing collection.'},
    {n:1, cap:'<b>is-a</b>: <span class="key">Stack extends Vector</span> inherits everything — including methods that break stack semantics.'},
    {n:2, cap:'That’s a <b>fragile base</b>: changes to Vector, or its leaked methods, can corrupt the Stack.'},
    {n:3, cap:'Refactor to <b>has-a</b>: the Stack holds a <span class="key">List</span> field instead of extending it.'},
    {n:4, cap:'Each operation <b>delegates</b> to that field, exposing only <span class="key">push</span>/<span class="key">pop</span>.'},
    {n:5, cap:'Now you can <b>swap</b> the list implementation freely — flexibility inheritance never gave you.'},
  ],
  playH2:'A car delegates to its engine', playFile:'Composition.java',
  playIntro:'A Car HAS-A Engine and asks it for power, rather than being an Engine. Model the delegated computation.',
  playCode:'// Car has-a Engine; it DELEGATES the power question\nint engineHorsepower = 200;\nint carWeightKg = 1400;\nint powerToWeight = engineHorsepower * 1000 / carWeightKg;  // delegated calc\nSystem.out.println("engine hp       = " + engineHorsepower);\nSystem.out.println("power-to-weight = " + powerToWeight);\nSystem.out.println("Swap the engine field -> new behavior, no subclassing.");',
  callouts:[
    {lang:'python', body:"Python’s multiple inheritance and mixins make inheritance tempting, but the same advice holds — composition and delegation (often via <span class='key'>__getattr__</span> forwarding) scale better. Java’s <em>single</em> inheritance nudges you toward composition sooner."},
    {lang:'js', body:"JS favors composition naturally — objects and functions combine without a class hierarchy. Java’s <span class='key'>extends</span> looks inviting, but the lesson is the same: hold collaborators as fields and delegate rather than deep-subclassing."},
    {lang:'go', body:"Go takes this to the limit: there’s <b>no inheritance at all</b> — only struct embedding (composition) and interfaces. Java’s “prefer composition” is simply Go’s default, which is why Go code rarely has the fragile-base problem."},
  ],
  exercises:[
    {h3:'Spot the smell', prompt:"<span class='key'>class EmailService extends SmtpClient</span> so it can send mail. Why is that likely the wrong relationship?",
     hint:"An EmailService isn’t a kind of SmtpClient — it <b>uses</b> one (has-a). Extending exposes SmtpClient’s whole API and couples you to it. Hold an <span class='key'>SmtpClient</span> (ideally an interface) as a field and delegate."},
    {h3:'Why so fragile?', prompt:"How can adding a method to a base class break a subclass that never changed — the “fragile base class” problem?",
     hint:"If the new base method has the same name/signature the subclass already used differently (or the base starts calling an overridden method internally), behavior shifts unexpectedly. Composition avoids this: a delegate’s new methods are invisible unless you forward them."},
  ],
};

// ───────────────────────── 11 Static Members & Class Design ─────────────────────────
MODS['11'] = {
  num:'11', slug:'static-members', title:'Static Members & Class Design', navShort:'Static', track:T2,
  heroTitle:'State and behavior that belong to the <span class="grad">class, not the object</span>',
  lede:"Every Java program starts in a static method — main. Static members belong to the class itself, shared across all instances. Used well they give you constants, factories, and utilities; used carelessly they become global mutable state that wrecks testability.",
  conceptH2:'One copy for the class, not one per object',
  conceptHtml:
    "<p>An <strong>instance</strong> field exists once per object; a <span class='key'>static</span> field exists <em>once per class</em>, shared by every instance. A <span class='key'>static</span> method has no <span class='key'>this</span> — it can’t touch instance state, which makes it perfect for stateless utilities and factory methods.</p>"+
    cb('class Counter {\n    static int created = 0;          // one value, shared by the class\n    final int id;\n    Counter() { id = ++created; }    // each object gets a unique id\n    static Counter make() { return new Counter(); }  // factory method\n}\n\nstatic final double PI = 3.14159;    // a constant: static + final')+
    "<p>Good uses: <strong>constants</strong> (<span class='key'>static final</span>), <strong>factory methods</strong> (<span class='key'>List.of</span>, <span class='key'>Integer.valueOf</span>), and pure <strong>utilities</strong> (<span class='key'>Math.max</span>). A <strong>static initializer</strong> block runs once when the class loads. The danger: <em>static mutable state</em> is global state — it’s shared everywhere, hard to reset between tests, and unsafe under concurrency. Keep static things either constant or stateless.</p>",
  stages:[{t:'instance field',s:'per object',c:'cyan'},{t:'static field',s:'one, shared',c:'purple'},{t:'static method',s:'no this',c:'amber'},{t:'static final',s:'constant',c:'emerald'},{t:'static init',s:'on class load',c:'coral'}],
  stepH2:'Where each kind of member lives',
  stepIntro:'Step through instance vs static members and when each is the right tool — ending with the global-state trap.',
  steps:[
    {n:0, cap:'A class can hold two kinds of members: per-object and per-class.'},
    {n:1, cap:'An <b>instance field</b> gets its own copy in every object you create.'},
    {n:2, cap:'A <b>static field</b> is a single value <b>shared</b> by the class and all its instances.'},
    {n:3, cap:'A <b>static method</b> has no <span class="key">this</span> — great for stateless utilities and factories.'},
    {n:4, cap:'<b>static final</b> marks a true constant; a <b>static initializer</b> runs once when the class loads.'},
    {n:5, cap:'Beware: <b>static mutable</b> state is global state — shared everywhere, hard to test, unsafe under threads.'},
  ],
  playH2:'Shared vs per-object state', playFile:'Static.java',
  playIntro:'A static field is shared by the whole class; an instance field is private to each object. Model both counters.',
  playCode:'// static = one shared value; instance = one per object\nint myOwnCount = 1;        // each object has its own\nint sharedTotal = 0;       // the class shares this one\nsharedTotal = sharedTotal + 1;   // object A created\nsharedTotal = sharedTotal + 1;   // object B created\nSystem.out.println("this object\\u2019s own count = " + myOwnCount);\nSystem.out.println("shared static total      = " + sharedTotal);\nSystem.out.println("static final MAX (constant) = " + 100);',
  callouts:[
    {lang:'python', body:"Java’s static fields ≈ Python class attributes, and static methods ≈ <span class='key'>@staticmethod</span> (a method bound to the class, no <span class='key'>self</span>). Java has no module-level functions — a free function becomes a <span class='key'>static</span> method on a class."},
    {lang:'js', body:"JS classes have <span class='key'>static</span> fields/methods too, and module-scope values play the role Java gives <span class='key'>static</span>. The same warning applies in both: a shared mutable static/module variable is global state and a testing headache."},
    {lang:'csharp', body:"Nearly one-to-one: <span class='key'>static</span> fields/methods, <span class='key'>const</span>/<span class='key'>static readonly</span> for constants, and static constructors ≈ Java’s static initializer blocks. Same guidance about avoiding shared mutable static state."},
  ],
  exercises:[
    {h3:'Static or instance?', prompt:"A <span class='key'>formatCurrency(long cents)</span> helper uses no object state. Should it be static or an instance method?",
     hint:"<b>Static.</b> It depends only on its arguments, not on any object’s fields, so it needs no <span class='key'>this</span>. Making it static signals “pure utility” and lets callers use it without constructing an instance."},
    {h3:'The testing trap', prompt:"A class keeps a <span class='key'>static Map</span> cache that tests mutate. Why do the tests start failing intermittently?",
     hint:"The static cache is shared across all tests and persists between them, so one test’s entries leak into another — order-dependent, flaky failures. Static mutable state is global state; prefer instance state you can recreate per test (or reset it explicitly)."},
  ],
};

// ───────────────────────── 12 SOLID Principles ─────────────────────────
MODS['12'] = {
  num:'12', slug:'solid-principles', title:'SOLID Principles', navShort:'SOLID', track:T2,
  heroTitle:'Five rules for <span class="grad">classes that don’t rot</span>',
  lede:"SOLID is five design principles that keep object-oriented code flexible as it grows. They tie together everything in this track — encapsulation, polymorphism, composition, interfaces, and dependency injection — into a checklist for classes that survive change.",
  conceptH2:'S · O · L · I · D',
  conceptHtml:
    "<p><strong>S — Single Responsibility:</strong> a class should have one reason to change. A class that parses <em>and</em> validates <em>and</em> saves is three classes wearing a trench coat.</p>"+
    "<p><strong>O — Open/Closed:</strong> open for extension, closed for modification. Add behavior by adding a new type (a new <span class='key'>Shape</span> implementation), not by editing a giant <span class='key'>switch</span>.</p>"+
    "<p><strong>L — Liskov Substitution:</strong> a subtype must be usable anywhere its supertype is, without surprises. If <span class='key'>Square extends Rectangle</span> breaks code that sets width and height independently, you’ve violated it.</p>"+
    "<p><strong>I — Interface Segregation:</strong> prefer many small interfaces over one fat one. Don’t force a class to implement methods it doesn’t need.</p>"+
    "<p><strong>D — Dependency Inversion:</strong> depend on abstractions, not concretions. High-level code should rely on an interface and have the implementation injected (see the DI module).</p>"+
    cb('// OCP + DIP: new behavior via a new type, injected as an interface\ninterface Discount { int apply(int cents); }\nclass BlackFriday implements Discount { public int apply(int c){ return c/2; } }\n\nclass Checkout {\n    private final Discount discount;          // depend on the abstraction\n    Checkout(Discount discount) { this.discount = discount; }   // injected\n}'),
  stages:[{t:'S',s:'one responsibility',c:'cyan'},{t:'O',s:'open/closed',c:'amber'},{t:'L',s:'substitutable',c:'purple'},{t:'I',s:'small interfaces',c:'emerald'},{t:'D',s:'depend on abstractions',c:'coral'}],
  stepH2:'The five principles, one at a time',
  stepIntro:'Step through SOLID as a checklist — each letter a question to ask of any class you design.',
  steps:[
    {n:0, cap:'SOLID is five lenses for judging an object-oriented design.'},
    {n:1, cap:'<b>S</b>ingle Responsibility: does this class have just <b>one reason to change</b>?'},
    {n:2, cap:'<b>O</b>pen/Closed: can I add behavior by <b>adding a type</b> rather than editing existing code?'},
    {n:3, cap:'<b>L</b>iskov: can any subtype stand in for its supertype <b>without breaking</b> callers?'},
    {n:4, cap:'<b>I</b>nterface Segregation: are interfaces <b>small and focused</b>, not fat catch-alls?'},
    {n:5, cap:'<b>D</b>ependency Inversion: does high-level code depend on <b>abstractions</b>, with implementations injected?'},
  ],
  playH2:'Single Responsibility as a metric', playFile:'Solid.java',
  playIntro:'SRP in miniature: a class with one reason to change passes; pile on responsibilities and it fails.',
  playCode:'// Count a class\\u2019s reasons-to-change (its responsibilities)\nint responsibilities = 1;     // focused class\nboolean followsSRP = responsibilities <= 1;\nSystem.out.println("responsibilities = " + responsibilities);\nSystem.out.println("follows SRP? " + followsSRP);\nint bloated = 3;              // parses + validates + saves\nSystem.out.println("bloated class follows SRP? " + (bloated <= 1));',
  callouts:[
    {lang:'python', body:"SOLID is language-agnostic and applies to Python too, though duck typing softens ISP and DIP (you depend on a shape of object, not a declared interface). The SRP and OCP advice carries over unchanged."},
    {lang:'js', body:"The same principles guide JS/TS design; DIP shows up as passing dependencies into functions/constructors rather than importing concretes. TypeScript interfaces make ISP and DIP feel very Java-like."},
    {lang:'csharp', body:"SOLID grew up largely in the C#/Java OO world, so it maps directly — interfaces, <span class='key'>virtual</span>/<span class='key'>override</span> for LSP, and built-in DI containers for DIP. Same checklist, same payoff."},
  ],
  exercises:[
    {h3:'Name the violation', prompt:"A <span class='key'>Report</span> class formats HTML, queries the database, and emails the result. Which SOLID letter does it break, and how do you fix it?",
     hint:"<b>S</b> (Single Responsibility) — it has three reasons to change. Split it into a formatter, a repository, and a mailer, each with one job, and coordinate them (often via injected dependencies, which also serves <b>D</b>)."},
    {h3:'Open/Closed in practice', prompt:"Adding each new payment type means editing a growing <span class='key'>switch(type)</span>. Which principle is strained, and what’s the OO fix?",
     hint:"<b>O</b> (Open/Closed). Replace the switch with a <span class='key'>PaymentMethod</span> interface and one implementation per type; adding a payment means adding a class, not modifying existing, tested code (polymorphism doing the dispatch)."},
  ],
};

module.exports = { MODS };
