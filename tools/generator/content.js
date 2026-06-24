// content.js — authored content for modules 02–15. Module 01 already hand-built.
const attrEsc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const cb = src => '<pre class="code" data-src="'+attrEsc(src)+'"></pre>';

// nav list (all 15) for prev/next wiring
const NAV = [
  { num:'01', slug:'jvm-machine',           title:"The JVM: Your Code's Real Computer" },
  { num:'02', slug:'memory-model',          title:'Stack, Heap & the Garbage Collector' },
  { num:'03', slug:'bytecode',              title:'From Source to Bytecode' },
  { num:'04', slug:'types-and-vars',        title:'Static Types, Primitives & Boxing' },
  { num:'05', slug:'objects-classes',       title:'Objects, Classes & Constructors' },
  { num:'06', slug:'inheritance',           title:'Inheritance & Polymorphism' },
  { num:'07', slug:'interfaces',            title:'Interfaces & Abstract Classes' },
  { num:'08', slug:'enums',                 title:'Enums & Constant Types' },
  { num:'09', slug:'packages-access',       title:'Packages & Access Control' },
  { num:'10', slug:'strings',               title:'Strings & Text' },
  { num:'11', slug:'equals-hashcode',       title:'The equals & hashCode Contract' },
  { num:'12', slug:'generics',              title:'Generics & Type Erasure' },
  { num:'13', slug:'collections',           title:'The Collections Framework' },
  { num:'14', slug:'exceptions',            title:'Checked vs Unchecked Exceptions' },
  { num:'15', slug:'nested-classes',        title:'Nested, Inner & Anonymous Classes' },
  { num:'16', slug:'lambdas-streams',       title:'Lambdas & the Streams API' },
  { num:'17', slug:'optional-null',         title:'Optional & the Billion-Dollar Bug' },
  { num:'18', slug:'records-sealed',        title:'Records, Sealed Types & Pattern Matching' },
  { num:'19', slug:'datetime',              title:'Dates & Times (java.time)' },
  { num:'20', slug:'annotations-reflection',title:'Annotations & Reflection' },
  { num:'21', slug:'concurrency',           title:'Threads, Executors & Virtual Threads' },
  { num:'22', slug:'build-tools',           title:'Maven, Gradle & the Classpath' },
  { num:'23', slug:'testing',               title:'JUnit & Modern Testing' },
  { num:'24', slug:'spring-di',             title:'Dependency Injection & Spring' },
  { num:'25', slug:'persistence-jdbc',      title:'Databases: JDBC & JPA' },
  { num:'26', slug:'json-jackson',          title:'JSON with Jackson' },
  { num:'27', slug:'http-client',           title:'The HTTP Client (java.net.http)' },
  { num:'28', slug:'logging',               title:'Logging Done Right' },
];

const T1 = 'Track 1: The Machine', T2 = 'Track 2: The Language', T3 = 'Track 3: Modern Java', T4 = 'Track 4: The Ecosystem', T5 = 'Track 5: Real-World Java';

const CONTENT = {};

// ───────────────────────── 02 ─────────────────────────
CONTENT['02'] = {
  num:'02', slug:'memory-model', title:'Stack, Heap & the Garbage Collector', navShort:'Memory', track:T1,
  heroTitle:'Two regions of memory, <span class="grad">one of them automatic</span>',
  lede:"Java splits memory into a fast, tidy stack and a sprawling heap — then hires a robot, the garbage collector, to clean the heap so you never call free(). Knowing which value lives where explains nearly every “why is it null / why did it copy” moment.",
  conceptH2:'Stack values, heap objects, and a reference between them',
  conceptHtml:
    "<p>Every method call gets a <strong>stack frame</strong> — a small, short-lived scratchpad holding its local variables. Primitives (<span class='key'>int</span>, <span class='key'>boolean</span>, …) live <em>directly</em> in that frame. Objects do not: <span class='key'>new</span> allocates them on the <strong>heap</strong>, and the stack variable holds only a <strong>reference</strong> (an arrow) to them.</p>"+
    "<p>That single distinction explains Java's assignment rules. Copy an <span class='key'>int</span> and you copy the value. Copy an object variable and you copy the <em>arrow</em> — both now point at the same heap object.</p>"+
    cb('int a = 10;\nint b = a;      // copies the VALUE 10\n\nint[] xs = {1, 2, 3};\nint[] ys = xs;  // copies the REFERENCE — same array!\nys[0] = 99;     // xs[0] is now 99 too')+
    "<p>Nobody frees the heap by hand. When no live reference can reach an object anymore, the <strong>garbage collector</strong> proves it unreachable and reclaims the space.</p>",
  stages:[{t:'main()',s:'stack frame',c:'cyan'},{t:'new int[]',s:'heap alloc',c:'purple'},{t:'reference',s:'stack → heap',c:'amber'},{t:'GC mark',s:'reachable?',c:'emerald'},{t:'GC sweep',s:'reclaim',c:'coral'}],
  stepH2:'Follow one object from birth to garbage',
  stepIntro:'Watch an array travel from allocation to collection. The stack holds the reference; the heap holds the object; the GC decides when it dies.',
  steps:[
    {n:0, cap:'Program hasn’t allocated anything yet. The heap is empty; the stack is ready.'},
    {n:1, cap:'<b>main()</b> is called. A stack frame appears to hold its local variables.'},
    {n:2, cap:'<b>new int[]</b> allocates the array on the <b>heap</b> — the stack frame is too short-lived to own it.'},
    {n:3, cap:'The local variable holds a <b>reference</b> (an arrow) from the stack into the heap object.'},
    {n:4, cap:'When the method returns, the reference disappears. The GC <b>marks</b> what is still reachable from live roots.'},
    {n:5, cap:'The now-unreachable array is <b>swept</b> away and its memory reclaimed — no <span class="key">free()</span> needed.'},
  ],
  playH2:'Value copy vs reference copy', playFile:'Memory.java',
  playIntro:'Primitives copy their value; an object variable copies its reference. Run this to see the stack-vs-heap rule in numbers.',
  playCode:'int a = 10;\nint b = a;      // value copied onto the stack\na = 99;         // changing a cannot touch b\nSystem.out.println("a = " + a);\nSystem.out.println("b = " + b);\n\nint bytesPerInt = 4;\nint count = 1000000;\nSystem.out.println("1,000,000 ints ≈ " + (bytesPerInt * count / 1024) + " KB on the heap");',
  callouts:[
    {lang:'python', body:"Python heap-allocates almost everything and reference-counts plus cycle-collects. Java is similar in spirit, but <em>primitives are not objects</em> — an <span class='key'>int</span> is a raw value on the stack, not a boxed <span class='key'>PyObject</span>, which is why Java numeric code is so fast."},
    {lang:'js', body:"JS also has “primitives copy, objects share a reference,” so the assignment rules feel identical. The difference is that V8's GC is hidden; the JVM exposes and lets you <em>tune</em> its collectors (G1, ZGC) for latency or throughput."},
    {lang:'csharp', body:"Nearly identical: C# <span class='key'>struct</span>s live on the stack like Java primitives, and <span class='key'>class</span>es on the heap like Java objects. The CLR GC is generational, just like the JVM's."},
  ],
  exercises:[
    {h3:'Will it print 99?', prompt:"Given <span class='key'>int[] xs = {1,2,3}; int[] ys = xs; ys[0] = 99;</span> — what does <span class='key'>xs[0]</span> print, and why?",
     hint:"<b>99</b>. <span class='key'>ys = xs</span> copies the reference, not the array, so both names point at the same heap object. Mutating through one is visible through the other."},
    {h3:'When does it become garbage?', prompt:"A method allocates a big <span class='key'>byte[]</span> into a local variable and returns. When is that array eligible for collection?",
     hint:"As soon as the method returns, its stack frame (and the only reference) is gone, so the array is unreachable and eligible immediately. The GC reclaims it on its next run, not necessarily right away."},
  ],
};

// ───────────────────────── 03 ─────────────────────────
CONTENT['03'] = {
  num:'03', slug:'bytecode', title:'From Source to Bytecode', navShort:'Bytecode', track:T1,
  heroTitle:'What <span class="grad">javac</span> actually produces',
  lede:"javac doesn’t make machine code — it makes bytecode for a stack machine that adds by pushing operands and popping results. Peek inside a .class file once and the JVM stops being a black box.",
  conceptH2:'A stack machine, not a register machine',
  conceptHtml:
    "<p>Your CPU has registers; the JVM has an <strong>operand stack</strong>. To compute <span class='key'>2 + 3</span>, bytecode <em>pushes</em> 2, <em>pushes</em> 3, then <span class='key'>iadd</span> pops both and pushes 5. Every method is a little stack program.</p>"+
    cb('// Source\nint r = 2 + 3 * 4;\n\n// Bytecode (conceptually)\niconst_2        // push 2\niconst_3        // push 3\niconst_4        // push 4\nimul            // 3*4 -> push 12\niadd            // 2+12 -> push 14\nistore_1        // pop into local r')+
    "<p>Compilation is a pipeline: source text → <strong>tokens</strong> (lexing) → an <strong>AST</strong> (parsing + type checking) → <strong>bytecode</strong> plus a <strong>constant pool</strong> of names and literals. You can read any of it with <span class='key'>javap -c YourClass</span>.</p>",
  stages:[{t:'.java',s:'source',c:'cyan'},{t:'tokens',s:'lexer',c:'amber'},{t:'AST',s:'parser + types',c:'purple'},{t:'.class',s:'bytecode',c:'emerald'},{t:'constant pool',s:'symbols',c:'coral'}],
  stepH2:'Compile one expression, stage by stage',
  stepIntro:'Trace 2 + 3 * 4 from characters to verified bytecode. javac validates types along the way so the JVM doesn’t have to.',
  steps:[
    {n:0, cap:'We’re about to compile the expression <span class="key">2 + 3 * 4</span>.'},
    {n:1, cap:'It starts as <b>source text</b> on disk — just the characters <span class="key">2 + 3 * 4</span>.'},
    {n:2, cap:'The <b>lexer</b> turns characters into <b>tokens</b>: <span class="key">2</span>, <span class="key">+</span>, <span class="key">3</span>, <span class="key">*</span>, <span class="key">4</span>.'},
    {n:3, cap:'The <b>parser</b> builds an <b>AST</b> and type-checks it, honoring precedence: <span class="key">*</span> binds tighter than <span class="key">+</span>.'},
    {n:4, cap:'Code generation emits <b>bytecode</b> for the operand stack: push, multiply, add, store.'},
    {n:5, cap:'Names and literals are deduplicated into the <b>constant pool</b> the bytecode refers to by index.'},
  ],
  playH2:'Be the operand stack', playFile:'StackMachine.java',
  playIntro:'Simulate what the bytecode does: each line is one push/op. The results match what iadd and imul would leave on the stack.',
  playCode:'// iconst_2, iconst_3, iadd\nint added = 2 + 3;\nSystem.out.println("iadd -> " + added);\n\n// then iconst_4, imul\nint result = added * 4;\nSystem.out.println("imul -> " + result);\n\nSystem.out.println("Whole expression 2+3 then *4 = " + result);',
  callouts:[
    {lang:'python', body:"CPython also compiles to bytecode for a stack machine (see <span class='key'>dis.dis</span>). The big difference: Java ships and verifies its <span class='key'>.class</span> bytecode and JIT-compiles it to native; CPython mostly interprets <span class='key'>.pyc</span>."},
    {lang:'js', body:"There's no user-visible bytecode file in JS — V8 builds bytecode internally and throws it away. Java makes the artifact explicit, which is why tools like <span class='key'>javap</span>, ASM, and bytecode agents exist."},
    {lang:'go', body:"Go skips the VM entirely and emits native machine code. You can read Go's assembly with <span class='key'>go tool objdump</span>, but it targets a real CPU — Java bytecode targets the imaginary one."},
  ],
  exercises:[
    {h3:'Predict the order', prompt:"For <span class='key'>5 - 2 - 1</span>, write the sequence of pushes and <span class='key'>isub</span>s. Does it evaluate left-to-right or right-to-left?",
     hint:"Left-to-right: push 5, push 2, <span class='key'>isub</span> → 3; push 1, <span class='key'>isub</span> → 2. Subtraction is left-associative, so it is (5-2)-1, not 5-(2-1)."},
    {h3:'Why a constant pool?', prompt:"A class uses the string <span class='key'>\"OK\"</span> in five places. How many times is it stored in the <span class='key'>.class</span> file?",
     hint:"Once. The constant pool deduplicates literals and symbolic names; the five usages all reference the same pool index, keeping the file compact."},
  ],
};

// ───────────────────────── 04 ─────────────────────────
CONTENT['04'] = {
  num:'04', slug:'types-and-vars', title:'Static Types, Primitives & Boxing', navShort:'Types', track:T2,
  heroTitle:'Eight primitives and <span class="grad">their object twins</span>',
  lede:"Java has two parallel number worlds: lightweight primitives (int, long, double…) and their boxed objects (Integer, Long, Double). Autoboxing blurs the line — until a cached == comparison or a surprise NullPointerException reminds you the line is real.",
  conceptH2:'Primitives are values; wrappers are objects',
  conceptHtml:
    "<p>An <span class='key'>int</span> is 32 raw bits on the stack. An <span class='key'>Integer</span> is a heap object that <em>wraps</em> an int. <strong>Autoboxing</strong> converts between them automatically, so you rarely notice — but the conversion is real and occasionally bites.</p>"+
    cb('int prim = 42;            // raw value\nInteger boxed = prim;     // autobox: Integer.valueOf(42)\nint back = boxed;         // unbox\n\nInteger a = 127, b = 127; // cached -> SAME object\nInteger c = 200, d = 200; // not cached -> different objects\nSystem.out.println(a == b); // true  (cache -128..127)\nSystem.out.println(c == d); // false (compare with .equals!)')+
    "<p>The JVM caches boxed integers from −128 to 127, so <span class='key'>==</span> on small values accidentally works and on large ones doesn't. The rule: <strong>compare objects with <span class='key'>.equals()</span></strong>, reserve <span class='key'>==</span> for primitives and identity.</p>",
  stages:[{t:'42',s:'int literal',c:'emerald'},{t:'int',s:'primitive',c:'cyan'},{t:'autobox',s:'valueOf()',c:'amber'},{t:'Integer',s:'heap object',c:'purple'},{t:'cache −128..127',s:'reuse',c:'coral'}],
  stepH2:'Watch an int become an Integer',
  stepIntro:'Follow the literal 42 as it is stored as a primitive, then autoboxed into a wrapper object — and learn where the integer cache changes the answer.',
  steps:[
    {n:0, cap:'We’ll follow the number 42 from literal to wrapper object.'},
    {n:1, cap:'We begin with a <b>literal</b> in the source: the number 42.'},
    {n:2, cap:'Assigned to an <span class="key">int</span>, it is stored as a raw <b>primitive</b> value — no object involved.'},
    {n:3, cap:'Assigning it to an <span class="key">Integer</span> triggers <b>autoboxing</b>: <span class="key">Integer.valueOf(42)</span>.'},
    {n:4, cap:'A wrapper <b>object</b> now lives on the heap; the variable holds a reference to it.'},
    {n:5, cap:'Because 42 is within <b>−128..127</b>, the JVM returns a <b>cached</b> instance — so <span class="key">==</span> on two such boxes is surprisingly true.'},
  ],
  playH2:'Integer division, remainder & comparisons', playFile:'Types.java',
  playIntro:"Java's int division truncates and never throws on overflow the way you'd hope. Run this to feel the type rules.",
  playCode:'int a = 7;\nint b = 2;\nSystem.out.println("7 / 2 = " + (a / b));   // integer division truncates -> 3\nSystem.out.println("7 % 2 = " + (a % b));   // remainder -> 1\n\nboolean bigger = a > b;\nSystem.out.println("a > b ? " + bigger);    // true\nSystem.out.println("equal ? " + (a == b));  // false',
  callouts:[
    {lang:'python', body:"Python 3's <span class='key'>/</span> always gives a float and ints are arbitrary precision. Java's <span class='key'>int</span> is fixed 32-bit and <span class='key'>/</span> truncates; use <span class='key'>//</span>-style thinking and reach for <span class='key'>long</span> or <span class='key'>BigInteger</span> when values grow."},
    {lang:'js', body:"JS has one number type (double). Java's eight primitives mean you choose <span class='key'>int</span> vs <span class='key'>long</span> vs <span class='key'>double</span> deliberately, and integer math is exact — no <span class='key'>0.1 + 0.2</span> surprises for whole numbers."},
    {lang:'csharp', body:"Almost the same model: C# value types vs reference types, with boxing on assignment to <span class='key'>object</span>. C# lacks Java's small-integer cache, so the <span class='key'>==</span> gotcha is Java-specific."},
  ],
  exercises:[
    {h3:'Two ways to be 1000', prompt:"<span class='key'>Integer x = 1000, y = 1000;</span> Does <span class='key'>x == y</span> return true? What about <span class='key'>x.equals(y)</span>?",
     hint:"<span class='key'>x == y</span> is <b>false</b> (1000 is outside the −128..127 cache, so they're distinct objects). <span class='key'>x.equals(y)</span> is <b>true</b>. Always use <span class='key'>.equals</span> for value comparison."},
    {h3:'The hidden NPE', prompt:"<span class='key'>Integer count = null; int n = count;</span> compiles fine. What happens at runtime?",
     hint:"It throws <span class='key'>NullPointerException</span> on the unboxing line: assigning a null <span class='key'>Integer</span> to an <span class='key'>int</span> calls <span class='key'>count.intValue()</span> on null."},
  ],
};

// ───────────────────────── 05 ─────────────────────────
CONTENT['05'] = {
  num:'05', slug:'objects-classes', title:'Objects, Classes & Constructors', navShort:'Objects', track:T2,
  heroTitle:'A class is a <span class="grad">blueprint</span>; new stamps out objects',
  lede:"In Java, almost everything you build is a class with fields, a constructor, and methods. There are no free functions and no top-level code — understanding the new→allocate→construct sequence is understanding how Java programs come alive.",
  conceptH2:'From class definition to living object',
  conceptHtml:
    "<p>A <strong>class</strong> declares state (<em>fields</em>) and behavior (<em>methods</em>). A <strong>constructor</strong> runs once, right after allocation, to put a new object into a valid initial state. The <span class='key'>new</span> operator does three things in order: allocate heap memory, run the constructor, hand back a reference.</p>"+
    cb('class Account {\n    private int balance;            // field (state)\n\n    Account(int opening) {          // constructor\n        this.balance = opening;\n    }\n    void deposit(int amount) {      // method (behavior)\n        this.balance += amount;\n    }\n    int balance() { return balance; }\n}\n\nAccount a = new Account(100);       // allocate + construct\na.deposit(50);                      // a.balance() == 150')+
    "<p>Fields default to zero / <span class='key'>false</span> / <span class='key'>null</span> before the constructor runs. The constructor's job is to replace those defaults with meaningful values — ideally leaving no half-built object observable.</p>",
  stages:[{t:'new Account',s:'operator',c:'cyan'},{t:'allocate',s:'heap slot',c:'purple'},{t:'<init>',s:'constructor',c:'amber'},{t:'fields set',s:'valid state',c:'emerald'},{t:'reference',s:'returned',c:'coral'}],
  stepH2:'What new Account(100) really does',
  stepIntro:'The new operator is three steps masquerading as one. Step through allocation, construction, and the reference you get back.',
  steps:[
    {n:0, cap:'We have a class blueprint but no instances yet.'},
    {n:1, cap:'<span class="key">new Account(100)</span> begins — the operator that creates an instance.'},
    {n:2, cap:'The JVM <b>allocates</b> a heap slot sized for Account’s fields, all set to defaults (balance = 0).'},
    {n:3, cap:'The <b>constructor</b> (<span class="key">&lt;init&gt;</span>) runs, assigning <span class="key">this.balance = 100</span>.'},
    {n:4, cap:'The object now holds a <b>valid initial state</b> — no half-built instance is exposed.'},
    {n:5, cap:'A <b>reference</b> to the finished object is returned and stored in your variable.'},
  ],
  playH2:'An object’s state over time', playFile:'Account.java',
  playIntro:'We can’t define classes in this mini-JVM, but we can model one object’s mutable state the way the methods would change it.',
  playCode:'// new Account(100), then deposit(50), withdraw(30)\nint balance = 100;\nbalance = balance + 50;   // deposit\nbalance = balance - 30;   // withdraw\nSystem.out.println("Balance: " + balance);\n\nboolean overdrawn = balance < 0;\nSystem.out.println("Overdrawn? " + overdrawn);',
  callouts:[
    {lang:'python', body:"No <span class='key'>self</span> as an explicit first parameter — Java uses an implicit <span class='key'>this</span>. And Java's constructor is named after the class, not <span class='key'>__init__</span>. Fields are usually declared up front, not created ad-hoc in the constructor."},
    {lang:'js', body:"Java classes aren't sugar over prototypes — they're the real, only model. There's no object literal <span class='key'>{}</span>; you must define a class (or a <span class='key'>record</span>) first. Visibility (<span class='key'>private</span>) is enforced by the compiler, not a <span class='key'>#</span> convention."},
    {lang:'csharp', body:"Very close: fields, constructors, <span class='key'>this</span>, and <span class='key'>new</span> all match. Java lacks C# properties (<span class='key'>get; set;</span>), so you'll write explicit getter/setter methods or use <span class='key'>record</span>s."},
  ],
  exercises:[
    {h3:'Default before construct', prompt:"A class has an <span class='key'>int count;</span> field and a constructor that doesn't touch it. What is <span class='key'>count</span> right after <span class='key'>new</span>?",
     hint:"<b>0</b>. Numeric fields default to 0, booleans to <span class='key'>false</span>, and object references to <span class='key'>null</span> — before and unless the constructor overrides them."},
    {h3:'Why private?', prompt:"Why make <span class='key'>balance</span> <span class='key'>private</span> and expose <span class='key'>deposit()</span> instead of letting callers set it directly?",
     hint:"Encapsulation: the class controls its invariants. <span class='key'>deposit()</span> can validate (reject negatives), log, or notify. A public field gives callers raw access with no guardrails."},
  ],
};

// ───────────────────────── 06 ─────────────────────────
CONTENT['07'] = {
  num:'07', slug:'interfaces', title:'Interfaces & Abstract Classes', navShort:'Interfaces', track:T2,
  heroTitle:'Program to a <span class="grad">contract</span>, not a class',
  lede:"An interface is a promise: “whatever you are, you can do these things.” It's how Java achieves polymorphism without inheritance, lets a class play many roles, and powers everything from Comparable to the Streams API.",
  conceptH2:'One contract, many implementations',
  conceptHtml:
    "<p>An <strong>interface</strong> declares method signatures with no bodies (mostly). Any class can <span class='key'>implements</span> it, promising to supply those methods. Callers depend on the interface, so they work with <em>any</em> implementation — present or future.</p>"+
    cb('interface Shape {\n    double area();           // contract, no body\n}\n\nclass Circle implements Shape {\n    double r;\n    public double area() { return Math.PI * r * r; }\n}\nclass Square implements Shape {\n    double side;\n    public double area() { return side * side; }\n}\n\nShape s = new Circle();      // a Circle, seen as a Shape\ndouble a = s.area();         // dynamic dispatch picks Circle.area')+
    "<p>At the call site the JVM uses <strong>dynamic dispatch</strong>: it looks up the actual object's method at runtime. Prefer interfaces over abstract classes; use an <span class='key'>abstract class</span> only when you must share state or partial implementation. A class extends one class but can implement many interfaces.</p>",
  conceptAfter:"<div class='callout callout-csharp'><span class='lang-tag'><span class='dot'></span>Same idea, familiar name</span><p>Java interfaces map almost one-to-one onto C# interfaces — down to <span class='key'>default</span> methods (C# 8's default interface methods). The Java twist: interfaces can't hold instance state.</p></div>",
  stages:[{t:'s.area()',s:'interface ref',c:'cyan'},{t:'actual type?',s:'Circle',c:'purple'},{t:'method table',s:'lookup area',c:'amber'},{t:'Circle.area',s:'run body',c:'emerald'},{t:'result',s:'returned',c:'coral'}],
  stepH2:'How a call finds the right method',
  stepIntro:'You call area() on a Shape, but a Circle answers. Step through dynamic dispatch — the runtime mechanism behind every interface call.',
  steps:[
    {n:0, cap:'We hold a <span class="key">Shape</span> and ask it for its area — but which area?'},
    {n:1, cap:'A variable of type <span class="key">Shape</span> holds some object — we call <span class="key">.area()</span> on it.'},
    {n:2, cap:'The reference is typed as <b>Shape</b>, but the JVM looks at the <b>actual object</b>: a Circle.'},
    {n:3, cap:'It consults the object’s <b>method table</b> to find Circle’s implementation of <span class="key">area</span>.'},
    {n:4, cap:'<b>Circle.area()</b> runs — <span class="key">πr²</span> — not Square’s or the interface’s.'},
    {n:5, cap:'The computed area is returned. Swap in a Square and the same call site runs Square’s formula instead.'},
  ],
  playH2:'Same question, different formulas', playFile:'Shapes.java',
  playIntro:'Polymorphism means one message, many implementations. Here are two shapes answering “what is your area?” their own way.',
  playCode:'// Circle and Square both satisfy a Shape contract\nint squareSide = 5;\nint squareArea = squareSide * squareSide;\n\nint rectW = 4;\nint rectH = 6;\nint rectArea = rectW * rectH;\n\nSystem.out.println("Square area    = " + squareArea);\nSystem.out.println("Rectangle area = " + rectArea);\nSystem.out.println("One contract, two implementations.");',
  callouts:[
    {lang:'python', body:"Python leans on duck typing — if it has <span class='key'>area()</span>, it works. Java wants the promise <em>declared</em>: a class must say <span class='key'>implements Shape</span>, and the compiler checks it. <span class='key'>Protocol</span>/<span class='key'>ABC</span> is the closest Python analog."},
    {lang:'js', body:"JS has no real interfaces (TypeScript bolts them on, erased at runtime). Java interfaces exist at runtime — you can check <span class='key'>instanceof Shape</span> and dispatch on it."},
    {lang:'go', body:"Go interfaces are <em>implicit</em>: satisfy the methods and you implement it. Java is <em>explicit</em>: you must write <span class='key'>implements</span>. Trade-off: Go is terser, Java makes the intent and errors clearer."},
  ],
  exercises:[
    {h3:'Class vs interface', prompt:"When should you reach for an <span class='key'>abstract class</span> instead of an <span class='key'>interface</span>?",
     hint:"When implementations must <b>share state or common code</b>. Interfaces can't hold instance fields. If subclasses need a shared field or a fully written helper method tied to that state, an abstract class fits; otherwise prefer an interface."},
    {h3:'Many roles', prompt:"Can one class implement both <span class='key'>Comparable</span> and <span class='key'>Runnable</span>? Can it extend two classes?",
     hint:"Yes to many interfaces — a class can <span class='key'>implements Comparable, Runnable</span>. No to two classes: Java has single class inheritance. Interfaces are how Java sidesteps the diamond problem."},
  ],
};

// ───────────────────────── 07 ─────────────────────────
CONTENT['12'] = {
  num:'12', slug:'generics', title:'Generics & Type Erasure', navShort:'Generics', track:T2,
  heroTitle:'Compile-time safety that <span class="grad">vanishes</span> at runtime',
  lede:"Generics let List<String> reject an Integer before your program runs. But the JVM never sees the <String> — it's erased to plain List. That erasure is the source of every weird generics rule you'll meet.",
  conceptH2:'The compiler knows; the runtime doesn’t',
  conceptHtml:
    "<p>A generic type like <span class='key'>List&lt;String&gt;</span> is a promise the <strong>compiler</strong> enforces: only Strings go in, only Strings come out, and it inserts the casts for you. After type-checking, the compiler performs <strong>type erasure</strong> — <span class='key'>&lt;String&gt;</span> is removed and the bytecode just uses <span class='key'>List</span>.</p>"+
    cb('List<String> names = new ArrayList<>();\nnames.add("Ada");\n// names.add(42);          // compile error, caught early\nString first = names.get(0); // no cast needed in source\n\n// After erasure, the bytecode is effectively:\nList raw = new ArrayList();\nString first2 = (String) raw.get(0);  // compiler-inserted cast')+
    "<p>Because the type argument is gone at runtime, you <em>can't</em> write <span class='key'>new T[]</span>, can't do <span class='key'>list instanceof List&lt;String&gt;</span>, and <span class='key'>List&lt;String&gt;</span> and <span class='key'>List&lt;Integer&gt;</span> share one class object. Erasure was the price of adding generics in Java 5 without breaking old code.</p>",
  stages:[{t:'List<String>',s:'source',c:'cyan'},{t:'type check',s:'compiler',c:'amber'},{t:'erase <T>',s:'remove type',c:'purple'},{t:'List (raw)',s:'bytecode',c:'emerald'},{t:'(String) cast',s:'inserted',c:'coral'}],
  stepH2:'Watch the type argument disappear',
  stepIntro:'Generics are a compile-time fiction. Step through how the compiler checks your types, then throws the type argument away before emitting bytecode.',
  steps:[
    {n:0, cap:'We’ll watch <span class="key">List&lt;String&gt;</span> lose its type argument on the way to bytecode.'},
    {n:1, cap:'You write <span class="key">List&lt;String&gt;</span> — a list specialized to Strings, in source.'},
    {n:2, cap:'The compiler <b>type-checks</b> every <span class="key">add</span> and <span class="key">get</span> against String, rejecting an Integer.'},
    {n:3, cap:'Type checking done, the compiler <b>erases</b> <span class="key">&lt;String&gt;</span> — the JVM doesn’t need it.'},
    {n:4, cap:'The emitted <b>bytecode</b> uses the raw <span class="key">List</span>; <span class="key">List&lt;String&gt;</span> and <span class="key">List&lt;Integer&gt;</span> become the same class.'},
    {n:5, cap:'Wherever you read a value, the compiler quietly <b>inserts a cast</b> back to String, so it feels type-safe.'},
  ],
  playH2:'What you write vs what the JVM sees', playFile:'Erasure.java',
  playIntro:'A quick illustration of erasure: the declared type carries the <T>, the runtime type does not.',
  playCode:'String declared = "List<String>";\nString runtime  = "List";\nSystem.out.println("You wrote:  " + declared);\nSystem.out.println("JVM sees:   " + runtime);\nSystem.out.println("Same class object for List<String> and List<Integer>? " + (runtime == runtime));',
  callouts:[
    {lang:'python', body:"Python's type hints (<span class='key'>list[str]</span>) are also erased — ignored at runtime unless a checker like mypy runs. Java goes further: it <em>enforces</em> them at compile time and inserts real casts, so violations can't even compile."},
    {lang:'js', body:"Plain JS has no generics; TypeScript's are erased on compile, much like Java's. The mental model transfers directly — generics catch bugs in the editor, then disappear from the running code."},
    {lang:'csharp', body:"The opposite choice: C# generics are <b>reified</b> — <span class='key'>List&lt;int&gt;</span> exists at runtime, you can do <span class='key'>typeof(T)</span> and <span class='key'>new T[]</span>. Java erases, C# keeps. This is the single biggest generics difference."},
  ],
  exercises:[
    {h3:'Why no new T[]?', prompt:"Why can't you write <span class='key'>T[] arr = new T[10];</span> inside a generic class?",
     hint:"At runtime <span class='key'>T</span> has been erased, so the JVM doesn't know what type of array to allocate. The usual workaround is an <span class='key'>Object[]</span> with casts, or <span class='key'>(T[]) Array.newInstance(clazz, n)</span> using a passed-in <span class='key'>Class&lt;T&gt;</span>."},
    {h3:'One class, two types', prompt:"What does <span class='key'>new ArrayList&lt;String&gt;().getClass() == new ArrayList&lt;Integer&gt;().getClass()</span> return?",
     hint:"<b>true</b>. After erasure both are just <span class='key'>ArrayList</span>; the type argument leaves no runtime trace, so they share one <span class='key'>Class</span> object."},
  ],
};

// ───────────────────────── 08 ─────────────────────────
CONTENT['13'] = {
  num:'13', slug:'collections', title:'The Collections Framework', navShort:'Collections', track:T2,
  heroTitle:'Lists, Sets and Maps, and <span class="grad">when to pick which</span>',
  lede:"Java ships a small, well-worn set of data structures behind three interfaces: List, Set, and Map. Knowing how HashMap finds a key in O(1) — and when it degrades — is core Java literacy.",
  conceptH2:'Three interfaces, a handful of workhorse classes',
  conceptHtml:
    "<p>Program to the interface, choose the implementation for its performance: <span class='key'>List</span> (ordered, indexed — usually <span class='key'>ArrayList</span>), <span class='key'>Set</span> (no duplicates — <span class='key'>HashSet</span>), <span class='key'>Map</span> (key→value — <span class='key'>HashMap</span>).</p>"+
    cb('Map<String, Integer> ages = new HashMap<>();\nages.put("Ada", 36);\nages.put("Alan", 41);\nint a = ages.get("Ada");          // O(1) average\n\nList<String> names = new ArrayList<>();\nnames.add("Ada"); names.add("Ada"); // duplicates OK\nSet<String> unique = new HashSet<>(names); // -> just one "Ada"')+
    "<p>A <span class='key'>HashMap</span> turns a key into an array index: take the key's <span class='key'>hashCode()</span>, spread its bits, and reduce modulo the bucket count. Two keys landing in one bucket is a <strong>collision</strong>, handled by a short chain (which becomes a tree if it grows). When the table gets too full it <strong>resizes</strong> and rehashes.</p>",
  stages:[{t:'put(k, v)',s:'entry',c:'cyan'},{t:'hashCode()',s:'spread bits',c:'amber'},{t:'h % capacity',s:'bucket index',c:'purple'},{t:'collision?',s:'chain / tree',c:'coral'},{t:'resize ×2',s:'rehash',c:'emerald'}],
  stepH2:'How a HashMap stores a key',
  stepIntro:'Put a key into a HashMap and watch it become an array index — including what happens on a collision and a resize.',
  steps:[
    {n:0, cap:'We’re about to insert a key/value entry into an empty-ish map.'},
    {n:1, cap:'You call <span class="key">map.put(key, value)</span> to insert an entry.'},
    {n:2, cap:'The map calls the key’s <b>hashCode()</b> and spreads the bits so similar keys scatter.'},
    {n:3, cap:'It reduces that hash <b>modulo capacity</b> to pick a bucket index in the backing array.'},
    {n:4, cap:'If another key already sits there — a <b>collision</b> — the entry joins a short chain (a tree past ~8).'},
    {n:5, cap:'When the table passes its load factor (~75% full), it <b>resizes ×2</b> and rehashes every entry.'},
  ],
  playH2:'Which bucket does a key land in?', playFile:'Buckets.java',
  playIntro:'Bucket = hash % capacity. Run this to see two near-identical hashes spread across a 16-slot table.',
  playCode:'int capacity = 16;\nint hashApple  = 93029210;   // pretend hashCode("apple")\nint hashBanana = 93029211;   // pretend hashCode("banana")\nSystem.out.println("apple  -> bucket " + (hashApple % capacity));\nSystem.out.println("banana -> bucket " + (hashBanana % capacity));\nSystem.out.println("Same bucket = a collision (handled by chaining).");',
  callouts:[
    {lang:'python', body:"<span class='key'>HashMap</span> ≈ <span class='key'>dict</span>, <span class='key'>ArrayList</span> ≈ <span class='key'>list</span>, <span class='key'>HashSet</span> ≈ <span class='key'>set</span>. Big difference: Java's <span class='key'>HashMap</span> does <em>not</em> preserve insertion order — use <span class='key'>LinkedHashMap</span> for that (Python dicts are ordered by default)."},
    {lang:'js', body:"Java's <span class='key'>Map</span> is a real interface with many implementations; JS's <span class='key'>Map</span> is one built-in. And Java keys use <span class='key'>equals()</span>/<span class='key'>hashCode()</span>, so two distinct objects that are <em>equal</em> collide as the same key — unlike JS's identity-based Map keys."},
    {lang:'csharp', body:"<span class='key'>Dictionary&lt;K,V&gt;</span> ≈ <span class='key'>HashMap</span>, <span class='key'>List&lt;T&gt;</span> ≈ <span class='key'>ArrayList</span>. Java separates the interface (<span class='key'>Map</span>) from the class (<span class='key'>HashMap</span>) more strictly, so you'll often declare the interface and instantiate the class."},
  ],
  exercises:[
    {h3:'Pick the structure', prompt:"You need to remember which user IDs you've already emailed, and ask “did I email 4187?” millions of times. Which collection?",
     hint:"A <span class='key'>HashSet&lt;Integer&gt;</span> (or a <span class='key'>Set</span>). Membership tests are O(1) average, and you don't care about order or duplicates — exactly a Set's job."},
    {h3:'The broken key', prompt:"You use a mutable object as a <span class='key'>HashMap</span> key, then change a field used in its <span class='key'>hashCode()</span>. Why can you no longer find it?",
     hint:"Its hash now points to a different bucket than where it was stored, so <span class='key'>get</span> looks in the wrong place. Map keys must be effectively immutable in their hashed fields."},
  ],
};

// ───────────────────────── 09 ─────────────────────────
CONTENT['14'] = {
  num:'14', slug:'exceptions', title:'Checked vs Unchecked Exceptions', navShort:'Exceptions', track:T2,
  heroTitle:'The compiler that <span class="grad">forces you to plan</span> for failure',
  lede:"Java is almost alone in having checked exceptions: failures the compiler won't let you ignore. Love them or hate them, you must know the difference between a checked IOException and an unchecked NullPointerException.",
  conceptH2:'Two families, one hierarchy',
  conceptHtml:
    "<p>Everything throwable descends from <span class='key'>Throwable</span>. The split that matters: <strong>checked</strong> exceptions (subclasses of <span class='key'>Exception</span> but not <span class='key'>RuntimeException</span>) <em>must</em> be caught or declared with <span class='key'>throws</span>. <strong>Unchecked</strong> exceptions (<span class='key'>RuntimeException</span> and friends) need no declaration.</p>"+
    cb('// Checked: the compiler insists you handle it\ntry {\n    Files.readString(path);        // throws IOException (checked)\n} catch (IOException e) {\n    log.warn("read failed", e);\n}\n\n// Unchecked: no try required; usually a bug to fix, not catch\nint len = name.length();           // NPE if name == null')+
    "<p>When an exception is thrown, the JVM <strong>unwinds the stack</strong>, popping frames until it finds a matching <span class='key'>catch</span>. A <span class='key'>finally</span> block runs either way — use it (or try-with-resources) to release resources.</p>",
  stages:[{t:'throw',s:'exception',c:'coral'},{t:'unwind',s:'pop frames',c:'amber'},{t:'find catch',s:'match type',c:'cyan'},{t:'handler',s:'recover',c:'emerald'},{t:'finally',s:'always runs',c:'purple'}],
  stepH2:'What happens when you throw',
  stepIntro:'Throwing an exception isn’t a goto — it’s a controlled stack unwind. Step through the search for a handler.',
  steps:[
    {n:0, cap:'Code is running normally, several method calls deep.'},
    {n:1, cap:'Something <b>throws</b> — say a division by zero raises ArithmeticException.'},
    {n:2, cap:'The JVM <b>unwinds</b>, popping stack frames one by one, abandoning their work.'},
    {n:3, cap:'At each frame it looks for a <span class="key">catch</span> whose type <b>matches</b> the exception.'},
    {n:4, cap:'A matching <b>handler</b> runs and the program recovers — or, if none is found, the thread dies with a stack trace.'},
    {n:5, cap:'Any <span class="key">finally</span> blocks along the way <b>always run</b>, releasing resources on the way out.'},
  ],
  playH2:'Guard before you leap', playFile:'Guard.java',
  playIntro:"This mini-JVM doesn't do try/catch, but it can show the guard you'd write to avoid an unchecked exception in the first place.",
  playCode:'int denominator = 0;\nboolean wouldThrow = denominator == 0;\nSystem.out.println("Divide 100 by " + denominator + "?");\nSystem.out.println("denominator == 0 is " + wouldThrow + " -> skip the divide");\nSystem.out.println("Unchecked bugs are prevented, not caught.");',
  callouts:[
    {lang:'python', body:"Python exceptions are all “unchecked” — nothing forces you to handle them, and you lean on EAFP (<span class='key'>try/except</span> liberally). Java's checked exceptions push the opposite habit: the signature tells callers exactly what can fail."},
    {lang:'js', body:"JS has no checked exceptions and no <span class='key'>throws</span> clause — any function might throw anything. Java's compiler makes the failure modes part of the API, which is more ceremony but fewer silent surprises."},
    {lang:'csharp', body:"C# deliberately dropped checked exceptions — its designers thought they scaled poorly. So a C# method's failures aren't in its signature; in Java, checked ones are. Expect more <span class='key'>throws</span> clauses and the occasional <span class='key'>catch</span>-and-wrap."},
  ],
  exercises:[
    {h3:'Catch or declare', prompt:"A method calls something that throws a checked <span class='key'>IOException</span> but doesn't catch it. What must its signature say to compile?",
     hint:"It must declare <span class='key'>throws IOException</span>, propagating the obligation to its caller. Checked exceptions must be either caught or declared — there's no third option."},
    {h3:'Catch or fix?', prompt:"Should you wrap every array access in <span class='key'>try/catch</span> for <span class='key'>ArrayIndexOutOfBoundsException</span>?",
     hint:"No. It's unchecked because it signals a bug — fix the index logic instead of catching it. Reserve <span class='key'>catch</span> for recoverable, often-checked conditions like a missing file or a dropped connection."},
  ],
};

// ───────────────────────── 10 ─────────────────────────
CONTENT['16'] = {
  num:'16', slug:'lambdas-streams', title:'Lambdas & the Streams API', navShort:'Lambdas & Streams', track:T3,
  heroTitle:'Describe the <span class="grad">what</span>, let Java do the loop',
  lede:"Lambdas gave Java functions-as-values; streams gave it a declarative pipeline for collections. Together they turn a noisy for-loop into a readable filter → map → collect — lazily, and often in parallel.",
  conceptH2:'A lazy pipeline of operations',
  conceptHtml:
    "<p>A <strong>lambda</strong> is an anonymous function: <span class='key'>x -&gt; x * 2</span>. A <strong>stream</strong> is a one-shot sequence you transform with chained operations. Intermediate steps (<span class='key'>filter</span>, <span class='key'>map</span>) are <em>lazy</em> — nothing runs until a <strong>terminal</strong> operation (<span class='key'>collect</span>, <span class='key'>sum</span>, <span class='key'>forEach</span>) pulls values through.</p>"+
    cb('List<Integer> nums = List.of(1, 2, 3, 4, 5);\n\nint total = nums.stream()\n    .filter(n -> n % 2 == 0)   // keep evens: 2, 4\n    .mapToInt(n -> n * 2)      // double them: 4, 8\n    .sum();                    // terminal -> 12\n\n// vs the old imperative loop\nint t = 0;\nfor (int n : nums) if (n % 2 == 0) t += n * 2;')+
    "<p>Laziness means a single pass handles the whole chain — each element flows filter→map→terminal before the next begins. Switch <span class='key'>.stream()</span> to <span class='key'>.parallelStream()</span> and the same pipeline can run across cores.</p>",
  stages:[{t:'stream()',s:'source',c:'cyan'},{t:'filter',s:'predicate',c:'amber'},{t:'map',s:'transform',c:'purple'},{t:'collect / sum',s:'terminal',c:'emerald'},{t:'result',s:'value',c:'coral'}],
  stepH2:'Push 1..5 through filter → map → sum',
  stepIntro:'Streams are lazy: the terminal operation drives everything. Step through how the pipeline pulls values rather than building intermediate lists.',
  steps:[
    {n:0, cap:'We have the numbers 1..5 ready as a stream source.'},
    {n:1, cap:'<span class="key">stream()</span> opens the pipeline — but nothing computes yet; it’s lazy.'},
    {n:2, cap:'<b>filter(n % 2 == 0)</b> will let only even values through: 2 and 4.'},
    {n:3, cap:'<b>map(n * 2)</b> transforms each survivor: 2→4, 4→8.'},
    {n:4, cap:'The <b>terminal</b> <span class="key">sum()</span> finally pulls values through the whole chain, one element at a time.'},
    {n:5, cap:'Result: <b>12</b>. No intermediate lists were built — just one lazy pass.'},
  ],
  playH2:'Run the pipeline by hand', playFile:'Streams.java',
  playIntro:'The mini-JVM can’t run real streams, but the arithmetic mirrors exactly what the pipeline computes.',
  playCode:'// stream(1..5).filter(even).map(x*2).sum()\nint keptSum = 2 + 4;       // filter kept 2 and 4\nint result  = keptSum * 2;  // each doubled, then summed\nSystem.out.println("filter(even) kept: 2, 4");\nSystem.out.println("map(x*2) then sum = " + result);',
  callouts:[
    {lang:'python', body:"Java streams are like comprehensions plus <span class='key'>itertools</span>, but method-chained: <span class='key'>filter</span>/<span class='key'>map</span> read left-to-right and stay lazy until a terminal op. <span class='key'>collect(toList())</span> is the rough equivalent of materializing a comprehension."},
    {lang:'js', body:"Very close to <span class='key'>arr.filter(...).map(...).reduce(...)</span> — but JS array methods are <b>eager</b> and build a new array each step. Java streams are <b>lazy</b> and single-pass, and a stream can't be reused once consumed."},
    {lang:'csharp', body:"This is LINQ with different names: <span class='key'>Where</span>=<span class='key'>filter</span>, <span class='key'>Select</span>=<span class='key'>map</span>, <span class='key'>Aggregate</span>=<span class='key'>reduce</span>. Both are lazy and composable; if you know LINQ, streams will feel like home."},
  ],
  exercises:[
    {h3:'Lazy or eager?', prompt:"A stream has <span class='key'>.filter(...).map(...)</span> but no terminal operation. How many elements get processed?",
     hint:"<b>Zero</b>. Intermediate operations are lazy — without a terminal op (<span class='key'>collect</span>, <span class='key'>count</span>, <span class='key'>forEach</span>…) nothing is pulled through and no work happens."},
    {h3:'Reuse trap', prompt:"You call a terminal op on a stream, then try to call another on the same stream variable. What happens?",
     hint:"<span class='key'>IllegalStateException</span> — “stream has already been operated upon or closed.” Streams are single-use; create a fresh one from the source to traverse again."},
  ],
};

// ───────────────────────── 11 ─────────────────────────
CONTENT['17'] = {
  num:'17', slug:'optional-null', title:'Optional & the Billion-Dollar Bug', navShort:'Optional', track:T3,
  heroTitle:'Make <span class="grad">“might be absent”</span> part of the type',
  lede:"Tony Hoare called null his “billion-dollar mistake.” Java can't remove null, but Optional lets a method's signature say “I might not return a value” — turning silent NullPointerExceptions into choices you make on purpose.",
  conceptH2:'A box that holds a value, or nothing',
  conceptHtml:
    "<p>An <span class='key'>Optional&lt;T&gt;</span> is a container that's either present (holds a T) or empty. Returning <span class='key'>Optional&lt;User&gt;</span> instead of <span class='key'>User</span> (which might be null) forces the caller to confront absence at compile time, not via a 2am stack trace.</p>"+
    cb('Optional<User> found = repo.findById(42);\n\n// Don’t: found.get() blows up if empty\nString name = found\n    .map(User::name)            // transform if present\n    .orElse("(unknown)");       // fallback if empty\n\n// Or branch explicitly\nfound.ifPresentOrElse(\n    u -> render(u),\n    () -> show404());')+
    "<p>Use <span class='key'>map</span>, <span class='key'>filter</span>, <span class='key'>orElse</span>, and <span class='key'>ifPresent</span> to flow through the box without ever touching null. Reserve <span class='key'>Optional</span> for return types — not fields or parameters — and never call <span class='key'>get()</span> without checking.</p>",
  stages:[{t:'findById(42)',s:'maybe null',c:'cyan'},{t:'Optional.of',s:'wrap',c:'purple'},{t:'map(User::name)',s:'if present',c:'amber'},{t:'orElse(...)',s:'fallback',c:'emerald'},{t:'value',s:'never null',c:'coral'}],
  stepH2:'Flow a lookup through the box',
  stepIntro:'Watch a lookup that might find nothing travel through an Optional without a single null check exploding.',
  steps:[
    {n:0, cap:'We ask a repository for user 42 — it may or may not exist.'},
    {n:1, cap:'The raw result <b>might be null</b>; the old way would blow up downstream.'},
    {n:2, cap:'Instead the value is <b>wrapped</b> in an Optional — present or empty, but never a bare null.'},
    {n:3, cap:'<b>map(User::name)</b> runs only if a value is present; on empty it simply stays empty.'},
    {n:4, cap:'<b>orElse(“(unknown)”)</b> supplies a fallback if the box is empty.'},
    {n:5, cap:'You always get a real, non-null value out — absence was handled on purpose.'},
  ],
  playH2:'Present or fallback', playFile:'Optionals.java',
  playIntro:'A simple model of isPresent / orElse — the value you get is never null.',
  playCode:'boolean present = true;\nString value    = "Ada";\nString fallback = "(unknown)";\nSystem.out.println("isPresent() = " + present);\nSystem.out.println("orElse gives: " + value);\nSystem.out.println("No surprise NullPointerException.");',
  callouts:[
    {lang:'python', body:"Python uses <span class='key'>None</span> plus <span class='key'>Optional[T]</span> type hints. Java's <span class='key'>Optional</span> is a real object with methods (<span class='key'>map</span>, <span class='key'>orElse</span>), closer to a one-element container than to a bare <span class='key'>None</span> sentinel."},
    {lang:'js', body:"Where JS reaches for <span class='key'>?.</span> and <span class='key'>??</span> on possibly-<span class='key'>undefined</span> values, Java wraps the value in <span class='key'>Optional</span> and chains <span class='key'>map</span>/<span class='key'>orElse</span>. Same goal — no null explosions — different shape."},
    {lang:'csharp', body:"Closest to C#'s nullable reference types (<span class='key'>User?</span>) plus the null-conditional operators. C# bakes nullability into the type system; Java bolts it on with the <span class='key'>Optional</span> wrapper, which is why Java says “return types only.”"},
  ],
  exercises:[
    {h3:'The anti-pattern', prompt:"Why is <span class='key'>optional.get()</span> right after <span class='key'>optional.isPresent()</span> frowned upon — and what's better?",
     hint:"It rebuilds the null-check ceremony Optional was meant to remove, and forgetting the guard throws <span class='key'>NoSuchElementException</span>. Prefer <span class='key'>map</span>/<span class='key'>orElse</span>/<span class='key'>ifPresent</span>, which can't be misused that way."},
    {h3:'Where not to use it', prompt:"Is <span class='key'>Optional&lt;String&gt;</span> a good type for a class <em>field</em>? Why or why not?",
     hint:"Generally no. <span class='key'>Optional</span> isn't <span class='key'>Serializable</span>, adds an allocation per field, and muddies object state. It's designed for <b>return values</b>; for fields, a plain nullable reference (well-documented) is idiomatic."},
  ],
};

// ───────────────────────── 12 ─────────────────────────
CONTENT['18'] = {
  num:'18', slug:'records-sealed', title:'Records, Sealed Types & Pattern Matching', navShort:'Records', track:T3,
  heroTitle:'Data classes, <span class="grad">without the boilerplate</span>',
  lede:"Modern Java fixed its most-mocked weakness: 40 lines of getters, equals, and hashCode for a simple data holder. Records, sealed types, and pattern matching turn that into a one-liner — and unlock exhaustive switches.",
  conceptH2:'Records carry data; sealed types bound the options',
  conceptHtml:
    "<p>A <strong>record</strong> is an immutable data carrier. One line generates the constructor, accessors, <span class='key'>equals</span>, <span class='key'>hashCode</span>, and <span class='key'>toString</span>. A <strong>sealed</strong> interface lists exactly which types may implement it — so the compiler can check a <span class='key'>switch</span> covers them all.</p>"+
    cb('record Point(int x, int y) {}      // all the boilerplate, generated\n\nsealed interface Shape permits Circle, Square {}\nrecord Circle(double r) implements Shape {}\nrecord Square(double s) implements Shape {}\n\ndouble area = switch (shape) {        // exhaustive: no default needed\n    case Circle c -> Math.PI * c.r() * c.r();\n    case Square s -> s.s() * s.s();\n};')+
    "<p><strong>Pattern matching</strong> in <span class='key'>switch</span> tests the type and binds the value in one step — and with a sealed hierarchy the compiler <em>fails the build</em> if you forget a case. Records can be deconstructed too: <span class='key'>case Point(int x, int y)</span>.</p>",
  stages:[{t:'record Point',s:'declare',c:'cyan'},{t:'x, y',s:'components',c:'purple'},{t:'equals/hashCode',s:'auto-generated',c:'amber'},{t:'switch pattern',s:'match type',c:'emerald'},{t:'deconstruct',s:'bind fields',c:'coral'}],
  stepH2:'From one line to an exhaustive switch',
  stepIntro:'Step through what a record gives you for free, and how sealed types make a switch provably complete.',
  steps:[
    {n:0, cap:'We want a simple immutable point with x and y.'},
    {n:1, cap:'<span class="key">record Point(int x, int y) {}</span> — one line <b>declares</b> the whole data class.'},
    {n:2, cap:'The two <b>components</b> become final fields plus accessors <span class="key">x()</span> and <span class="key">y()</span>.'},
    {n:3, cap:'<b>equals</b>, <b>hashCode</b>, and <b>toString</b> are generated from those components — value semantics for free.'},
    {n:4, cap:'A <b>switch</b> pattern-matches on a sealed type, testing and binding in one step.'},
    {n:5, cap:'Because the type is sealed, the compiler <b>deconstructs</b> every permitted case — miss one and the build fails.'},
  ],
  playH2:'A record’s value', playFile:'Records.java',
  playIntro:'Model a record’s components and a derived value. Real records add equals/hashCode automatically.',
  playCode:'// record Point(int x, int y)\nint x = 3;\nint y = 4;\nint distanceSquared = x * x + y * y;   // 9 + 16\nSystem.out.println("Point(" + x + ", " + y + ")");\nSystem.out.println("distanceSquared = " + distanceSquared);\nSystem.out.println("Two equal Points are .equals() for free.");',
  callouts:[
    {lang:'python', body:"A <span class='key'>record</span> is Java's <span class='key'>@dataclass</span> (or <span class='key'>NamedTuple</span>): auto <span class='key'>__init__</span>, <span class='key'>__eq__</span>, <span class='key'>__repr__</span>. Records are immutable by default — like a frozen dataclass — and pattern matching mirrors Python 3.10's <span class='key'>match</span>."},
    {lang:'js', body:"JS has no value-equality data type — two object literals are never <span class='key'>===</span> even with identical fields. A Java <span class='key'>record</span> gives real value equality and a generated <span class='key'>toString</span> out of the box."},
    {lang:'csharp', body:"Nearly identical to C# <span class='key'>record</span>s, including value equality and deconstruction. Java's sealed + switch patterns line up with C#'s pattern matching; the syntax differs but the ideas transfer directly."},
  ],
  exercises:[
    {h3:'What you get free', prompt:"List the members the compiler generates for <span class='key'>record User(String name, int age) {}</span>.",
     hint:"A canonical constructor <span class='key'>User(String, int)</span>; accessors <span class='key'>name()</span> and <span class='key'>age()</span>; plus <span class='key'>equals</span>, <span class='key'>hashCode</span>, and <span class='key'>toString</span> derived from both components. All fields are <span class='key'>final</span>."},
    {h3:'Why sealed helps', prompt:"How does sealing <span class='key'>Shape permits Circle, Square</span> let you drop the <span class='key'>default</span> branch in a switch?",
     hint:"The compiler knows the <em>complete</em> set of subtypes, so it can verify your <span class='key'>switch</span> handles all of them. That makes <span class='key'>default</span> unnecessary — and turns a forgotten case into a compile error instead of a runtime surprise."},
  ],
};

// ───────────────────────── 13 ─────────────────────────
CONTENT['21'] = {
  num:'21', slug:'concurrency', title:'Threads, Executors & Virtual Threads', navShort:'Concurrency', track:T3,
  heroTitle:'Don’t manage threads — <span class="grad">submit tasks</span>',
  lede:"Raw threads are expensive and easy to leak. Modern Java hands you an executor: submit a task, get a Future. And Java 21's virtual threads make it cheap to run millions of blocking tasks at once — rewriting the rules for server code.",
  conceptH2:'Tasks go to a pool; you get a Future',
  conceptHtml:
    "<p>Instead of <span class='key'>new Thread(...).start()</span>, you submit a task to an <strong>ExecutorService</strong> that owns a pool of worker threads. You get back a <span class='key'>Future</span> — a handle to the eventual result. The pool reuses threads, so you're not paying to create one per task.</p>"+
    cb('try (var pool = Executors.newFixedThreadPool(2)) {\n    Future<Integer> f = pool.submit(() -> expensive());\n    Integer result = f.get();     // blocks until ready\n}\n\n// Java 21: a thread per task, cheaply\ntry (var vt = Executors.newVirtualThreadPerTaskExecutor()) {\n    for (int i = 0; i < 1_000_000; i++)\n        vt.submit(() -> handle(request));   // millions, fine\n}')+
    "<p><strong>Virtual threads</strong> are lightweight threads scheduled by the JVM onto a few OS threads. A blocking call (I/O, <span class='key'>sleep</span>) parks the virtual thread without tying up an OS thread — so the simple blocking style scales to massive concurrency.</p>",
  stages:[{t:'submit task',s:'Runnable',c:'cyan'},{t:'work queue',s:'buffered',c:'amber'},{t:'executor',s:'thread pool',c:'purple'},{t:'run',s:'on a worker',c:'emerald'},{t:'Future',s:'result',c:'coral'}],
  stepH2:'A task’s journey through an executor',
  stepIntro:'Submit a task and follow it into the pool and back out as a Future. Then imagine a million of them on virtual threads.',
  steps:[
    {n:0, cap:'You have a unit of work — a <span class="key">Runnable</span> or <span class="key">Callable</span> — to run off the main thread.'},
    {n:1, cap:'You <b>submit</b> the task to an executor rather than creating a thread yourself.'},
    {n:2, cap:'It lands in a <b>work queue</b>, buffered until a worker is free.'},
    {n:3, cap:'The <b>executor</b>’s thread pool picks it up — threads are reused across many tasks.'},
    {n:4, cap:'A worker <b>runs</b> the task; with virtual threads, blocking parks cheaply instead of hogging an OS thread.'},
    {n:5, cap:'You hold a <b>Future</b> — call <span class="key">get()</span> to await the result when you need it.'},
  ],
  playH2:'Tasks, threads, and rounds', playFile:'Pool.java',
  playIntro:'A back-of-envelope model: how many sequential rounds a fixed pool needs for a batch of tasks.',
  playCode:'int tasks   = 4;\nint threads = 2;\nint rounds  = tasks / threads;\nSystem.out.println(tasks + " tasks on a pool of " + threads + " threads");\nSystem.out.println("=> about " + rounds + " sequential rounds");\nSystem.out.println("Virtual threads: a thread PER task, millions cheap.");',
  callouts:[
    {lang:'python', body:"Java threads run truly in parallel — there's no GIL — so CPU-bound work scales across cores natively. Virtual threads resemble <span class='key'>asyncio</span> tasks, but you write ordinary blocking code instead of <span class='key'>async</span>/<span class='key'>await</span>."},
    {lang:'js', body:"No single event loop here — Java is multi-threaded with shared, mutable memory, so you must guard shared state (<span class='key'>synchronized</span>, <span class='key'>java.util.concurrent</span>). Virtual threads give async-like scale while keeping a straight-line, blocking coding style."},
    {lang:'go', body:"Virtual threads are Java's answer to goroutines: cheap, JVM-scheduled, millions at a time. The executor + <span class='key'>Future</span> pairing is close to spawning goroutines and reading a channel for the result."},
  ],
  exercises:[
    {h3:'Why not new Thread per request?', prompt:"A server does <span class='key'>new Thread(...).start()</span> per request and falls over under load. What's the executor fix?",
     hint:"Platform threads are heavy (~1MB stack each) and unbounded creation exhausts memory. Use a bounded <span class='key'>ExecutorService</span> to cap and reuse them — or virtual threads, which are light enough for one-per-request."},
    {h3:'What does get() do?', prompt:"You submit a task and immediately call <span class='key'>future.get()</span>. Did you gain any concurrency?",
     hint:"Barely — <span class='key'>get()</span> blocks until the result is ready, so calling it immediately serializes you again. Submit all tasks first, then collect results, to actually overlap their work."},
  ],
};

// ───────────────────────── 14 ─────────────────────────
CONTENT['22'] = {
  num:'22', slug:'build-tools', title:'Maven, Gradle & the Classpath', navShort:'Build Tools', track:T4,
  heroTitle:'Where your code <span class="grad">finds its dependencies</span>',
  lede:"Java's superpower is its library ecosystem — reachable only through a build tool. Maven and Gradle resolve dependency trees, compile, test, and package, all hinging on one old idea you must understand: the classpath.",
  conceptH2:'Declare dependencies; the tool assembles the classpath',
  conceptHtml:
    "<p>You declare a dependency by coordinates — <span class='key'>group : artifact : version</span> — and the build tool downloads it (and <em>its</em> dependencies, transitively) from a repository into a local cache (Maven's <span class='key'>~/.m2</span>). At compile and run time, every jar must be on the <strong>classpath</strong>: the list of places the JVM searches for classes.</p>"+
    cb('<!-- Maven: pom.xml -->\n<dependency>\n  <groupId>com.google.guava</groupId>\n  <artifactId>guava</artifactId>\n  <version>33.0.0-jre</version>\n</dependency>\n\n// Gradle: build.gradle (terser)\nimplementation("com.google.guava:guava:33.0.0-jre")\n\n// What it becomes\njava -cp app.jar:guava.jar:... com.example.Main')+
    "<p>A <span class='key'>ClassNotFoundException</span> almost always means a jar is missing from the classpath; a <span class='key'>NoSuchMethodError</span> usually means two versions collided and the wrong one won. Build tools exist to make the classpath correct and reproducible so you don't assemble it by hand.</p>",
  stages:[{t:'pom.xml',s:'declare',c:'cyan'},{t:'resolve',s:'deps tree',c:'amber'},{t:'compile',s:'javac',c:'purple'},{t:'package',s:'jar',c:'emerald'},{t:'run',s:'classpath',c:'coral'}],
  stepH2:'From pom.xml to a running jar',
  stepIntro:'Follow a project through the build lifecycle Maven and Gradle share: resolve, compile, package, run.',
  steps:[
    {n:0, cap:'You have source code and a build file declaring your dependencies.'},
    {n:1, cap:'The build file (<b>pom.xml</b> or build.gradle) lists dependencies by group:artifact:version.'},
    {n:2, cap:'The tool <b>resolves</b> the full tree — your deps plus their deps — downloading once into a local cache.'},
    {n:3, cap:'It <b>compiles</b> your sources with javac against that classpath.'},
    {n:4, cap:'It <b>packages</b> the result into a jar (sometimes a fat jar bundling everything).'},
    {n:5, cap:'At <b>run</b> time the JVM searches the <span class="key">classpath</span> for every class it loads.'},
  ],
  playH2:'Count the classpath', playFile:'Classpath.java',
  playIntro:'Transitive dependencies multiply. Run this to estimate how many jars actually land on your classpath.',
  playCode:'int directDeps        = 3;\nint transitivePerDep  = 4;\nint totalJars = directDeps + directDeps * transitivePerDep;\nSystem.out.println("Direct dependencies:   " + directDeps);\nSystem.out.println("Jars on the classpath: " + totalJars);\nSystem.out.println("Maven caches them once in ~/.m2");',
  callouts:[
    {lang:'python', body:"Maven/Gradle are <span class='key'>pip</span> + <span class='key'>venv</span> + <span class='key'>setuptools</span> rolled into one, with a key win: <b>transitive resolution</b> is automatic. The classpath is roughly the import search path, but assembled per-build rather than per-environment."},
    {lang:'js', body:"<span class='key'>pom.xml</span>/<span class='key'>build.gradle</span> ≈ <span class='key'>package.json</span>, <span class='key'>~/.m2</span> ≈ <span class='key'>node_modules</span> (but shared across projects). Unlike npm's nested trees, Maven flattens to <b>one version per dependency</b> — hence occasional version-conflict resolution."},
    {lang:'csharp', body:"Maven/Gradle map onto NuGet + MSBuild; coordinates and restore-then-build are familiar. The classpath is the .NET assembly probing path's cousin — the runtime's list of where to find compiled types."},
  ],
  exercises:[
    {h3:'Read the error', prompt:"At startup you get <span class='key'>ClassNotFoundException: com.foo.Bar</span>. What category of problem is this, and where do you look?",
     hint:"A classpath problem — the jar containing <span class='key'>com.foo.Bar</span> isn't on the runtime classpath. Check that the dependency is declared with the right scope and is actually packaged/passed via <span class='key'>-cp</span>."},
    {h3:'Two versions walk in', prompt:"Two of your dependencies each pull in a different version of the same library. What decides which one is used, and what can break?",
     hint:"The build tool's conflict resolution picks one version (Maven: “nearest wins”). If code compiled against the other version calls a method missing from the winner, you get <span class='key'>NoSuchMethodError</span> at runtime."},
  ],
};

// ───────────────────────── 15 ─────────────────────────
CONTENT['23'] = {
  num:'23', slug:'testing', title:'JUnit & Modern Testing', navShort:'Testing', track:T4,
  heroTitle:'The <span class="grad">green bar</span> that lets you refactor fearlessly',
  lede:"JUnit is so central it ships in muscle memory: annotate a method @Test, arrange-act-assert, run. Add AssertJ for readable assertions and Mockito for fakes, and you have the safety net behind every confident Java change.",
  conceptH2:'Arrange, act, assert — one behavior per test',
  conceptHtml:
    "<p>A test is a method marked <span class='key'>@Test</span>. The runner finds it by that annotation, runs it in isolation, and reports pass or fail. The classic shape is <strong>arrange</strong> (set up inputs), <strong>act</strong> (call the thing), <strong>assert</strong> (check the result).</p>"+
    cb('class CalculatorTest {\n    @Test\n    void addsTwoNumbers() {\n        Calculator calc = new Calculator();   // arrange\n        int sum = calc.add(2, 3);             // act\n        assertEquals(5, sum);                 // assert\n    }\n}\n\n// AssertJ reads like a sentence\nassertThat(sum).isEqualTo(5);\n// Mockito fakes a collaborator\nwhen(repo.find(1)).thenReturn(new User("Ada"));')+
    "<p>Good tests are fast, independent, and named for the behavior they pin down. The payoff: a passing suite turns a scary refactor into a routine one — change the code, run the bar, trust the result.</p>",
  stages:[{t:'@Test',s:'method',c:'cyan'},{t:'arrange',s:'given',c:'amber'},{t:'act',s:'when',c:'purple'},{t:'assert',s:'then',c:'emerald'},{t:'report',s:'red / green',c:'coral'}],
  stepH2:'How the runner executes one test',
  stepIntro:'Step through what happens between writing @Test and seeing a green bar — the arrange-act-assert rhythm the runner drives.',
  steps:[
    {n:0, cap:'You’ve written a method describing one expected behavior.'},
    {n:1, cap:'The <span class="key">@Test</span> annotation marks it so the runner discovers it automatically.'},
    {n:2, cap:'<b>Arrange</b>: the test sets up its inputs and any fakes it needs.'},
    {n:3, cap:'<b>Act</b>: it calls the one method under test — the behavior being pinned down.'},
    {n:4, cap:'<b>Assert</b>: it checks the actual result against the expected one.'},
    {n:5, cap:'The runner <b>reports</b> red or green; a green suite makes the next refactor safe.'},
  ],
  playH2:'A passing assertion', playFile:'CalcTest.java',
  playIntro:'The essence of a unit test in numbers: expected vs actual, then a boolean verdict.',
  playCode:'// @Test addsTwoNumbers()\nint expected = 5;\nint actual   = 2 + 3;          // act\nboolean passed = expected == actual;   // assertEquals\nSystem.out.println("expected = " + expected + ", actual = " + actual);\nSystem.out.println("assertEquals passed? " + passed);\nSystem.out.println("A green suite makes the next refactor safe.");',
  callouts:[
    {lang:'python', body:"JUnit is <span class='key'>pytest</span>'s heavier, annotation-driven cousin: <span class='key'>@Test</span> instead of a <span class='key'>test_</span> name prefix, <span class='key'>assertEquals(a, b)</span> instead of bare <span class='key'>assert a == b</span>. AssertJ closes the readability gap."},
    {lang:'js', body:"<span class='key'>@Test</span> methods replace <span class='key'>it(...)</span> blocks; <span class='key'>@BeforeEach</span> is <span class='key'>beforeEach</span>. Mockito plays the role of Jest's mocking. The arrange-act-assert rhythm is identical to describe/it suites."},
    {lang:'csharp', body:"JUnit maps almost one-to-one onto xUnit/NUnit: <span class='key'>@Test</span> ≈ <span class='key'>[Fact]</span>/<span class='key'>[Test]</span>, <span class='key'>@BeforeEach</span> ≈ setup. Mockito ≈ Moq, AssertJ ≈ FluentAssertions. If you've tested in C#, you already test in Java."},
  ],
  exercises:[
    {h3:'Expected vs actual', prompt:"In <span class='key'>assertEquals(5, sum)</span>, which argument is the expected value and why does the order matter for the failure message?",
     hint:"The <b>first</b> argument is expected, the second actual. JUnit's message reads “expected: 5 but was: …”, so swapping them produces a misleading report even though the pass/fail result is the same."},
    {h3:'Why isolate?', prompt:"Why should each <span class='key'>@Test</span> be independent of the others, and what tool helps when a test has external collaborators?",
     hint:"Independent tests can run in any order and in parallel, and a failure points at one cause. For external collaborators (a DB, a service), use a mocking library like <span class='key'>Mockito</span> to supply fast, deterministic fakes."},
  ],
};

// ───────────────────────── 06 Inheritance ─────────────────────────
CONTENT['06'] = {
  num:'06', slug:'inheritance', title:'Inheritance & Polymorphism', navShort:'Inheritance', track:T2,
  heroTitle:'One class <span class="grad">extends</span> another',
  lede:"Inheritance lets a subclass reuse and specialize a parent. Combined with overriding, it gives you polymorphism: call one method name, run the right body for the actual object. It's powerful — and the thing modern Java tells you to use sparingly.",
  conceptH2:'extends, super, @Override, and dynamic dispatch',
  conceptHtml:
    "<p>A subclass <span class='key'>extends</span> a superclass, inheriting its fields and methods. It can add new ones and <strong>override</strong> existing ones. A subclass constructor must call a superclass constructor first — explicitly with <span class='key'>super(...)</span>, or implicitly via the no-arg one.</p>"+
    cb('class Animal {\n    String name;\n    Animal(String name) { this.name = name; }\n    String speak() { return "..."; }\n}\nclass Dog extends Animal {\n    Dog(String name) { super(name); }      // call parent constructor\n    @Override String speak() { return "Woof"; }\n}\n\nAnimal a = new Dog("Rex");   // upcast: a Dog seen as an Animal\nString s = a.speak();         // dynamic dispatch -> "Woof"')+
    "<p>The variable's type is <span class='key'>Animal</span>, but the JVM runs <span class='key'>Dog.speak()</span> because that's the real object — this is <strong>polymorphism</strong> via <strong>dynamic dispatch</strong>. Use <span class='key'>@Override</span> so the compiler catches typos; prefer composition over deep hierarchies, and reach for <span class='key'>final</span> to forbid further subclassing.</p>",
  stages:[{t:'class Dog',s:'extends Animal',c:'cyan'},{t:'super(name)',s:'parent init',c:'purple'},{t:'@Override',s:'speak()',c:'amber'},{t:'Animal a = Dog',s:'upcast',c:'emerald'},{t:'a.speak()',s:'dynamic dispatch',c:'coral'}],
  stepH2:'How a.speak() finds Dog’s version',
  stepIntro:'A variable typed as Animal holds a Dog. Step through construction and the overridden call that makes polymorphism work.',
  steps:[
    {n:0, cap:'We have an Animal base class and a Dog subclass that overrides speak().'},
    {n:1, cap:'<span class="key">class Dog extends Animal</span> — Dog inherits Animal’s fields and methods.'},
    {n:2, cap:'Constructing a Dog calls <b>super(name)</b> first, so the Animal part is initialized before Dog’s.'},
    {n:3, cap:'Dog <b>@Override</b>s <span class="key">speak()</span> with its own body returning “Woof”.'},
    {n:4, cap:'We <b>upcast</b>: an Animal-typed variable points at a Dog object.'},
    {n:5, cap:'Calling <span class="key">a.speak()</span> uses <b>dynamic dispatch</b> — the Dog’s override runs, not Animal’s.'},
  ],
  playH2:'Override changes the result', playFile:'Inheritance.java',
  playIntro:'Model a base behavior and a subclass that overrides it to add a bonus — the overriding object yields a different answer.',
  playCode:'// Employee.pay() = base; Manager overrides to add a bonus\nint basePay      = 5000;\nint managerBonus = 2000;\nint managerPay   = basePay + managerBonus;   // overridden behavior\nSystem.out.println("Employee pay = " + basePay);\nSystem.out.println("Manager pay  = " + managerPay);\nSystem.out.println("Manager earns more? " + (managerPay > basePay));',
  callouts:[
    {lang:'python', body:"Java has no multiple <em>class</em> inheritance — a class <span class='key'>extends</span> exactly one parent (use interfaces for the rest). And overriding needs matching signatures the compiler checks; there's no duck-typed silent shadowing like in Python."},
    {lang:'js', body:"<span class='key'>extends</span> and <span class='key'>super</span> look just like ES6 classes, but Java's are real types with static checking, not prototype sugar. <span class='key'>@Override</span> turns a mistyped method name into a compile error instead of an accidental new method."},
    {lang:'csharp', body:"Very close, with one trap: Java methods are <b>virtual by default</b>, so any non-final method can be overridden. C# requires <span class='key'>virtual</span>/<span class='key'>override</span> explicitly; in Java you add <span class='key'>final</span> to <em>prevent</em> overriding."},
  ],
  exercises:[
    {h3:'Who runs?', prompt:"<span class='key'>Animal a = new Dog(); a.speak();</span> — does Animal’s or Dog’s <span class='key'>speak()</span> run, and what decides?",
     hint:"Dog’s. Dynamic dispatch picks the method based on the <b>runtime object type</b> (Dog), not the declared variable type (Animal). The declared type only limits which methods you may <em>call</em>."},
    {h3:'Constructor order', prompt:"Why must a subclass constructor call <span class='key'>super(...)</span> before touching its own fields?",
     hint:"The parent’s state must be fully initialized before the subclass relies on it. Java enforces this: <span class='key'>super(...)</span> (explicit or implicit) is always the first statement of a constructor."},
  ],
};

// ───────────────────────── 08 Enums ─────────────────────────
CONTENT['08'] = {
  num:'08', slug:'enums', title:'Enums & Constant Types', navShort:'Enums', track:T2,
  heroTitle:'A type with a <span class="grad">fixed set</span> of values',
  lede:"An enum is a class whose instances are a known, finite list — Monday through Sunday, not “any string that might be a day.” Java enums go far beyond C-style integer constants: they carry fields, methods, and even per-constant behavior.",
  conceptH2:'Type-safe constants that are real objects',
  conceptHtml:
    "<p>Each enum constant is a singleton instance of the enum type. Because the set is closed, the compiler can make a <span class='key'>switch</span> exhaustive, and you get <span class='key'>name()</span>, <span class='key'>ordinal()</span>, and <span class='key'>values()</span> for free. Enums can also declare fields and methods.</p>"+
    cb('enum Planet {\n    EARTH(9.8), MARS(3.7);          // each constant passes a value\n    final double gravity;\n    Planet(double g) { this.gravity = g; }\n    double weight(double mass) { return mass * gravity; }\n}\n\nPlanet p = Planet.MARS;\ndouble w = p.weight(70);            // 259.0\nfor (Planet x : Planet.values()) { /* iterate all */ }')+
    "<p>Prefer enums over <span class='key'>int</span> or <span class='key'>String</span> constants: they're type-safe (you can't pass <span class='key'>\"mosday\"</span>), self-documenting, and work in <span class='key'>switch</span> and <span class='key'>EnumMap</span>. They're also the simplest correct way to write a singleton.</p>",
  stages:[{t:'enum Day',s:'declare',c:'cyan'},{t:'MON..SUN',s:'constants',c:'purple'},{t:'fields/methods',s:'on each',c:'amber'},{t:'switch',s:'exhaustive',c:'emerald'},{t:'values()',s:'iterate all',c:'coral'}],
  stepH2:'From a list of constants to an exhaustive switch',
  stepIntro:'Step through how an enum becomes a small set of singleton objects the compiler can reason about completely.',
  steps:[
    {n:0, cap:'We want a type that can only be one of the seven days — nothing else.'},
    {n:1, cap:'<span class="key">enum Day { ... }</span> declares a closed type.'},
    {n:2, cap:'Its <b>constants</b> MON…SUN are created as singleton instances of Day.'},
    {n:3, cap:'Each constant can carry <b>fields and methods</b> — an enum is a full class.'},
    {n:4, cap:'A <b>switch</b> over the enum is exhaustive: the compiler knows every possible case.'},
    {n:5, cap:'<span class="key">Day.values()</span> hands back all constants in order for <b>iteration</b>.'},
  ],
  playH2:'Ordinals and ordering', playFile:'Enums.java',
  playIntro:'Each enum constant has a zero-based ordinal (its declaration position). Model the day-of-week math.',
  playCode:'// enum Day { MON, TUE, WED, THU, FRI, SAT, SUN } — ordinals 0..6\nint MON = 0;\nint FRI = 4;\nint daysApart = FRI - MON;\nSystem.out.println("MON ordinal = " + MON);\nSystem.out.println("FRI ordinal = " + FRI);\nSystem.out.println("MON..FRI spans " + daysApart + " days");\nSystem.out.println("FRI is a weekday? " + (FRI < 5));',
  callouts:[
    {lang:'python', body:"Java enums are like <span class='key'>enum.Enum</span> but richer: each constant is a singleton object that can have constructors, fields, and methods, and even override a method per-constant. The exhaustive-<span class='key'>switch</span> guarantee has no plain-Python equivalent."},
    {lang:'js', body:"JS has no native enum — people fake it with frozen objects or string unions (TypeScript). Java's enum is a real, type-checked type, so a typo like <span class='key'>Day.MODNAY</span> won't compile."},
    {lang:'csharp', body:"C# <span class='key'>enum</span>s are thin wrappers over integers; any in-range int casts to one. Java enums are full objects with no implicit int conversion — safer, and they can hold behavior C# enums can't."},
  ],
  exercises:[
    {h3:'Why not int constants?', prompt:"Name two concrete advantages of <span class='key'>enum Suit { HEARTS, ... }</span> over <span class='key'>static final int HEARTS = 0;</span>.",
     hint:"Type safety (a method taking <span class='key'>Suit</span> can't receive a stray int like 99) and exhaustiveness/readability (switch coverage is checked; <span class='key'>toString</span> prints HEARTS, not 0). Bonus: they work as <span class='key'>EnumMap</span>/<span class='key'>EnumSet</span> keys."},
    {h3:'ordinal() trap', prompt:"Why is persisting <span class='key'>ordinal()</span> to a database a bug waiting to happen?",
     hint:"Ordinal is just declaration position. Reorder or insert a constant and every stored number now maps to a different value. Persist <span class='key'>name()</span> (or an explicit code field) instead."},
  ],
};

// ───────────────────────── 09 Packages & Access ─────────────────────────
CONTENT['09'] = {
  num:'09', slug:'packages-access', title:'Packages & Access Control', navShort:'Packages', track:T2,
  heroTitle:'Who can <span class="grad">see</span> your code',
  lede:"Packages give every Java type a globally unique name and a unit of encapsulation. The four access levels — public, protected, package-private, private — decide who may touch what. Get them right and your API surface stays small on purpose.",
  conceptH2:'Four levels, from wide open to sealed shut',
  conceptHtml:
    "<p>A <span class='key'>package</span> is a namespace, mirrored by folders: <span class='key'>com.acme.billing.Invoice</span> lives in <span class='key'>com/acme/billing/Invoice.java</span>. Within and across packages, four modifiers gate access:</p>"+
    cb('package com.acme.billing;\n\npublic class Invoice {       // visible everywhere\n    public int id;            // any code, any package\n    protected int draftNo;    // subclasses + same package\n    int internalCode;         // package-private (no keyword)\n    private int secret;       // this class only\n}')+
    "<p>The default — <strong>no modifier</strong> — is <em>package-private</em>, not public; it's Java's quiet encouragement to keep things internal. Make fields <span class='key'>private</span> and expose behavior through methods. The newer <strong>module system</strong> (JPMS, <span class='key'>module-info.java</span>) adds a layer above packages, letting a jar declare which packages it <span class='key'>exports</span>.</p>",
  stages:[{t:'private',s:'this class',c:'coral'},{t:'package-private',s:'same package',c:'purple'},{t:'protected',s:'+ subclasses',c:'amber'},{t:'public',s:'everyone',c:'emerald'},{t:'exports',s:'module level',c:'cyan'}],
  stepH2:'Widening the circle of access',
  stepIntro:'Step outward from the most private to the most public, seeing exactly who gains visibility at each level.',
  steps:[
    {n:0, cap:'We have a field and want to decide who may access it.'},
    {n:1, cap:'<b>private</b>: only code inside the same class can see it — the tightest scope.'},
    {n:2, cap:'<b>package-private</b> (no keyword): any class in the same package, the Java default.'},
    {n:3, cap:'<b>protected</b>: adds subclasses, even in other packages.'},
    {n:4, cap:'<b>public</b>: any class anywhere on the classpath can reach it.'},
    {n:5, cap:'Above packages, a module’s <b>exports</b> decides which packages are even visible to other jars.'},
  ],
  playH2:'Rank the access levels', playFile:'Access.java',
  playIntro:'Model each access level as a “reach” score — how widely the member is visible — from 1 (private) to 4 (public).',
  playCode:'int privateReach        = 1;   // this class only\nint packagePrivateReach = 2;   // same package (the default)\nint protectedReach      = 3;   // + subclasses elsewhere\nint publicReach         = 4;   // anywhere\nSystem.out.println("public wider than private? " + (publicReach > privateReach));\nSystem.out.println("default level (no keyword) reach = " + packagePrivateReach);\nSystem.out.println("Narrowest that still works is best.");',
  callouts:[
    {lang:'python', body:"Python relies on convention — a leading underscore <em>asks</em> you not to touch it but nothing enforces it. Java's modifiers are compiler-enforced: <span class='key'>private</span> genuinely cannot be accessed from outside."},
    {lang:'js', body:"Where JS uses <span class='key'>#private</span> fields and module exports, Java uses four access levels plus package structure. Java's <b>default is closed</b> (package-private), whereas a JS module member is private until you explicitly <span class='key'>export</span> it — same instinct, different default scope."},
    {lang:'go', body:"Go encodes visibility in capitalization (<span class='key'>Exported</span> vs <span class='key'>unexported</span>) at the package boundary — effectively just public vs package-private. Java adds <span class='key'>protected</span> and <span class='key'>private</span> for finer control."},
  ],
  exercises:[
    {h3:'What does no keyword mean?', prompt:"A field is declared <span class='key'>int total;</span> with no access modifier. Who can access it?",
     hint:"Any class in the <b>same package</b> — that's package-private, Java's default. It is <em>not</em> public; classes in other packages cannot see it."},
    {h3:'Least privilege', prompt:"You're unsure whether a helper method should be <span class='key'>public</span> or <span class='key'>private</span>. What's the safe default and why?",
     hint:"Start <span class='key'>private</span> (or package-private). You can always widen access later without breaking callers; narrowing a public API is a breaking change. Keep the public surface as small as possible."},
  ],
};

// ───────────────────────── 10 Strings ─────────────────────────
CONTENT['10'] = {
  num:'10', slug:'strings', title:'Strings & Text', navShort:'Strings', track:T2,
  heroTitle:'Immutable text and the <span class="grad">string pool</span>',
  lede:"Strings are objects, they're immutable, and identical literals are shared in a pool. That trio explains why == on strings is a trap, why heavy concatenation wants a StringBuilder, and why text blocks were such a welcome addition.",
  conceptH2:'Immutable, pooled, and built efficiently',
  conceptHtml:
    "<p>A <span class='key'>String</span> never changes — every “modification” returns a <em>new</em> object. String <em>literals</em> are <strong>interned</strong> in a shared pool, so two identical literals are the same reference; a <span class='key'>new String(\"x\")</span> is not. Hence: compare text with <span class='key'>.equals()</span>, never <span class='key'>==</span>.</p>"+
    cb('String a = "hi";\nString b = "hi";              // same pooled object as a\nString c = new String("hi");  // forced new object\nSystem.out.println(a == b);   // true  (pool)\nSystem.out.println(a == c);   // false (different object)\nSystem.out.println(a.equals(c)); // true (same text)\n\n// Build many pieces with a mutable buffer\nString s = new StringBuilder().append("x").append(1).toString();')+
    "<p>Because each <span class='key'>+</span> on strings allocates, looping concatenation should use a <strong>StringBuilder</strong>. For multi-line text, <strong>text blocks</strong> (<span class='key'>\"\"\"...\"\"\"</span>) keep JSON/SQL readable without escaping.</p>",
  stages:[{t:'"hi" literal',s:'source',c:'amber'},{t:'string pool',s:'interned',c:'cyan'},{t:'+ concat',s:'new object',c:'purple'},{t:'StringBuilder',s:'mutable buffer',c:'emerald'},{t:'toString()',s:'final String',c:'coral'}],
  stepH2:'Why concatenation makes new objects',
  stepIntro:'Follow a literal into the pool, then watch concatenation allocate fresh strings — and how StringBuilder avoids the churn.',
  steps:[
    {n:0, cap:'We start with a string literal written in source code.'},
    {n:1, cap:'The literal <span class="key">"hi"</span> is a String <b>object</b>.'},
    {n:2, cap:'Identical literals are <b>interned</b> in the string pool — they share one object, so <span class="key">==</span> is true.'},
    {n:3, cap:'Each <span class="key">+</span> builds a brand-new String; the originals are immutable and untouched.'},
    {n:4, cap:'In a loop that churns through many pieces, a <b>StringBuilder</b> mutates one buffer instead.'},
    {n:5, cap:'<span class="key">toString()</span> produces the final immutable String once, cheaply.'},
  ],
  playH2:'Immutability in action', playFile:'Strings.java',
  playIntro:'Reassigning a String makes a new object and leaves earlier copies untouched. Run it to see immutability.',
  playCode:'String s = "Java";\nString t = s + "";        // a new String equal in text to s\ns = s + " rocks";          // s now points at a NEW object\nSystem.out.println("s = " + s);   // Java rocks\nSystem.out.println("t = " + t);   // Java (unchanged)\nSystem.out.println("Every change makes a new String.");',
  callouts:[
    {lang:'python', body:"Good news: Python strings are also immutable and small ones are interned, so the mental model carries over. The Java twist is the explicit <span class='key'>==</span>-vs-<span class='key'>.equals()</span> distinction — in Python <span class='key'>==</span> already compares text."},
    {lang:'js', body:"JS strings are immutable primitives and <span class='key'>===</span> compares by value, so JS hides the pool. In Java a String is an <em>object</em>, so <span class='key'>==</span> compares references — use <span class='key'>.equals()</span> or you'll get intermittent false negatives."},
    {lang:'csharp', body:"Nearly identical: C# strings are immutable, interned, and you compare with <span class='key'>==</span> (overloaded) or <span class='key'>.Equals</span>. Java's <span class='key'>StringBuilder</span> ≈ C#'s, and Java text blocks ≈ C# raw/verbatim strings."},
  ],
  exercises:[
    {h3:'The == bug', prompt:"<span class='key'>String x = new String(\"hi\"); </span> Why might <span class='key'>x == \"hi\"</span> be false while <span class='key'>x.equals(\"hi\")</span> is true?",
     hint:"<span class='key'>new String</span> forces a fresh object outside the pool, so <span class='key'>==</span> (reference identity) is false. <span class='key'>.equals</span> compares the characters, which match — so it's true. Always compare text with <span class='key'>.equals</span>."},
    {h3:'Why StringBuilder?', prompt:"Concatenating 10,000 strings in a loop with <span class='key'>+=</span> is slow. What's happening, and the fix?",
     hint:"Each <span class='key'>+=</span> allocates a new String and copies everything so far — O(n²) work and garbage. Use a <span class='key'>StringBuilder</span> (one growing buffer, append in place) and call <span class='key'>toString()</span> once at the end."},
  ],
};

// ───────────────────────── 11 equals & hashCode ─────────────────────────
CONTENT['11'] = {
  num:'11', slug:'equals-hashcode', title:'The equals & hashCode Contract', navShort:'equals/hashCode', track:T2,
  heroTitle:'Why <span class="grad">==</span> lies, and equals tells the truth',
  lede:"Two objects can hold identical data yet be different instances. equals() defines value-equality; hashCode() must agree with it. Break their contract and HashMap silently loses your keys — one of Java's most common subtle bugs.",
  conceptH2:'Identity vs value, and the rule that ties them together',
  conceptHtml:
    "<p><span class='key'>==</span> asks “same object?” (identity). <span class='key'>equals()</span> asks “same value?” — but only if the class overrides it; the default <span class='key'>Object.equals</span> is just <span class='key'>==</span>. The <strong>contract</strong>: if <span class='key'>a.equals(b)</span>, then <span class='key'>a.hashCode() == b.hashCode()</span> <em>must</em> hold.</p>"+
    cb('class Point {\n    final int x, y;\n    Point(int x, int y) { this.x = x; this.y = y; }\n    @Override public boolean equals(Object o) {\n        if (!(o instanceof Point p)) return false;\n        return x == p.x && y == p.y;\n    }\n    @Override public int hashCode() { return Objects.hash(x, y); }\n}')+
    "<p>Override both, together, using the same fields. Why? A <span class='key'>HashMap</span> first picks a bucket by <span class='key'>hashCode()</span>, then confirms with <span class='key'>equals()</span>. If equal objects produce different hashes, they land in different buckets and the map can't find what it stored. (This is exactly why <span class='key'>record</span>s, which generate both, are so handy.)</p>",
  stages:[{t:'a == b',s:'identity',c:'coral'},{t:'a.equals(b)',s:'value',c:'cyan'},{t:'hashCode()',s:'must agree',c:'amber'},{t:'same bucket',s:'HashMap',c:'purple'},{t:'found',s:'lookup works',c:'emerald'}],
  stepH2:'How a HashMap relies on the contract',
  stepIntro:'Step through a map lookup to see exactly where hashCode and equals each do their job — and what breaks if they disagree.',
  steps:[
    {n:0, cap:'We store a value under a key object, then look it up with an equal-but-different key.'},
    {n:1, cap:'<span class="key">==</span> on the two keys is <b>false</b> — they’re distinct objects.'},
    {n:2, cap:'A correct <b>equals()</b> reports they’re equal by value, which is what we want.'},
    {n:3, cap:'<b>hashCode()</b> must return the same number for both, or the contract is broken.'},
    {n:4, cap:'The map uses the hash to land in the <b>same bucket</b> where the entry was stored.'},
    {n:5, cap:'Within the bucket, <span class="key">equals()</span> confirms the match and the value is <b>found</b>.'},
  ],
  playH2:'Equal values, agreeing hashes', playFile:'EqualsHash.java',
  playIntro:'The contract in miniature: equal values must yield equal hash codes. Run it to see both agree.',
  playCode:'// Two keys with the same logical value\nint valueA = 42;\nint valueB = 42;\nSystem.out.println("equals? " + (valueA == valueB));      // true\n// Their hash codes must agree, or HashMap breaks\nint hashA = valueA;\nint hashB = valueB;\nSystem.out.println("hashCodes agree? " + (hashA == hashB)); // true\nSystem.out.println("Equal objects MUST share a hashCode.");',
  callouts:[
    {lang:'python', body:"Same idea: override <span class='key'>__eq__</span> and <span class='key'>__hash__</span> together, or sets and dicts misbehave. Java just makes it explicit on every class, and <span class='key'>Objects.hash(...)</span> mirrors Python's habit of hashing a tuple of fields."},
    {lang:'js', body:"JS <span class='key'>Map</span>/<span class='key'>Set</span> use reference identity for object keys and offer no value-equality hook — so this whole contract is unfamiliar. In Java, equal-by-value objects can serve as the <em>same</em> key, which is powerful but demands a correct <span class='key'>hashCode</span>."},
    {lang:'csharp', body:"Directly analogous to overriding <span class='key'>Equals</span> and <span class='key'>GetHashCode</span> for <span class='key'>Dictionary</span> keys. Java's <span class='key'>record</span> ≈ C#'s <span class='key'>record</span>: both auto-generate a consistent pair so you don't have to."},
  ],
  exercises:[
    {h3:'The vanishing key', prompt:"You override <span class='key'>equals()</span> but forget <span class='key'>hashCode()</span>, then use the object as a <span class='key'>HashMap</span> key. What goes wrong?",
     hint:"The default <span class='key'>hashCode</span> is identity-based, so two equal objects usually get different hashes and different buckets. <span class='key'>get</span> looks in the wrong bucket and returns null — the entry is effectively lost."},
    {h3:'Hash quality', prompt:"Is <span class='key'>hashCode() { return 1; }</span> a <em>correct</em> implementation? Is it a <em>good</em> one?",
     hint:"Correct (equal objects share it, so the contract holds) but terrible: every key collides into one bucket, degrading the map to a linked list — O(n) lookups. A good hash spreads values across buckets."},
  ],
};

// ───────────────────────── 15 Nested classes ─────────────────────────
CONTENT['15'] = {
  num:'15', slug:'nested-classes', title:'Nested, Inner & Anonymous Classes', navShort:'Nested Classes', track:T2,
  heroTitle:'Classes <span class="grad">inside</span> classes',
  lede:"Java lets a class live inside another. The kind you choose — static nested, inner, local, or anonymous — decides whether it can reach the enclosing instance's state. Knowing the difference demystifies older listener code and sets up lambdas.",
  conceptH2:'Four flavors, one question: do you hold the outer instance?',
  conceptHtml:
    "<p>A <strong>static nested</strong> class is just a top-level class scoped inside another — no link to an outer instance. A non-static <strong>inner</strong> class holds a hidden reference to its enclosing object, so it can use its fields. A <strong>local</strong> class is declared inside a method; an <strong>anonymous</strong> class is a local class with no name, defined and instantiated at once.</p>"+
    cb('class Outer {\n    int count = 1;\n    static class Helper {}          // static nested: no Outer needed\n    class Inner { int read() { return count; } } // sees Outer.count\n}\n\n// Anonymous class implementing an interface, inline\nRunnable r = new Runnable() {\n    public void run() { System.out.println("hi"); }\n};\n// Lambda — the concise successor\nRunnable r2 = () -> System.out.println("hi");')+
    "<p>Anonymous classes (and lambdas) <strong>capture</strong> local variables, which must be <span class='key'>final</span> or effectively final. Prefer <span class='key'>static</span> nested classes unless you truly need the outer instance — a non-static inner class quietly keeps the outer object alive, a classic memory leak.</p>",
  stages:[{t:'static nested',s:'no outer ref',c:'cyan'},{t:'inner',s:'holds outer',c:'purple'},{t:'local',s:'in a method',c:'amber'},{t:'anonymous',s:'on the spot',c:'emerald'},{t:'lambda',s:'concise form',c:'coral'}],
  stepH2:'From named nested class to lambda',
  stepIntro:'Step along the spectrum from a fully independent nested class to a one-line lambda, watching what each can access.',
  steps:[
    {n:0, cap:'We want a helper type that lives alongside a class’s logic.'},
    {n:1, cap:'A <b>static nested</b> class is scoped inside but holds <b>no</b> reference to an outer instance.'},
    {n:2, cap:'A non-static <b>inner</b> class holds the enclosing instance, so it can read its fields.'},
    {n:3, cap:'A <b>local</b> class is declared inside a method, visible only there.'},
    {n:4, cap:'An <b>anonymous</b> class implements an interface inline, capturing effectively-final locals.'},
    {n:5, cap:'A <b>lambda</b> is the concise successor to a single-method anonymous class.'},
  ],
  playH2:'Capturing an outer value', playFile:'Nested.java',
  playIntro:'An inner/anonymous class closes over an effectively-final outer value. Model the capture and use.',
  playCode:'// An anonymous class / lambda captures this value\nint outerCount = 3;          // must be effectively final to capture\nint captured   = outerCount;  // the nested class closes over it\nint usedTwice  = captured * 2;\nSystem.out.println("outer value     = " + outerCount);\nSystem.out.println("captured & used = " + usedTwice);\nSystem.out.println("Lambdas replaced most anonymous classes.");',
  callouts:[
    {lang:'python', body:"Python nests functions and closures freely, capturing variables by reference. Java captures only <b>effectively final</b> locals (you can't reassign a captured variable), which prevents a whole class of confusing closure bugs."},
    {lang:'js', body:"JS closures capture live, mutable variables; Java's capture is read-only by value-of-a-final. The anonymous-class form is verbose like a pre-arrow-function callback — and lambdas are Java's arrow-function moment."},
    {lang:'csharp', body:"Static nested ≈ a nested class; Java's inner class ≈ a C# nested class holding a manual outer reference (C# nested classes are implicitly static-like). Anonymous classes map onto C# anonymous delegates, and lambdas line up directly."},
  ],
  exercises:[
    {h3:'static or not?', prompt:"You write a nested <span class='key'>Comparator</span> that never touches the outer instance's fields. Static nested or inner — and why?",
     hint:"<b>Static nested.</b> It doesn't need the enclosing instance, so making it inner would needlessly hold a reference to the outer object (preventing GC and wasting memory). Default to static unless you need the outer state."},
    {h3:'Capture rules', prompt:"Why won't this compile: a lambda uses a local <span class='key'>int n</span> that the method reassigns later?",
     hint:"Captured locals must be <b>effectively final</b> — assigned once. Reassigning <span class='key'>n</span> makes it non-final, so the lambda can't capture it. Copy it into a new final variable, or avoid the reassignment."},
  ],
};

// ───────────────────────── 19 Date & Time ─────────────────────────
CONTENT['19'] = {
  num:'19', slug:'datetime', title:'Dates & Times (java.time)', navShort:'Date & Time', track:T3,
  heroTitle:'A date/time API that <span class="grad">isn’t broken</span>',
  lede:"The old Date and Calendar were mutable, zero-indexed, thread-unsafe traps. Java 8's java.time replaced them with a clear, immutable model: LocalDate, LocalDateTime, Instant, Duration, and time zones that finally make sense.",
  conceptH2:'Immutable types for each kind of “when”',
  conceptHtml:
    "<p>Pick the type that matches the concept: <span class='key'>LocalDate</span> (a calendar date, no time), <span class='key'>LocalTime</span> (a time, no date), <span class='key'>LocalDateTime</span> (both, no zone), <span class='key'>Instant</span> (a point on the UTC timeline), <span class='key'>ZonedDateTime</span> (date-time + zone). Amounts are <span class='key'>Duration</span> (seconds) and <span class='key'>Period</span> (days/months).</p>"+
    cb('LocalDate today = LocalDate.now();\nLocalDate due   = today.plusDays(30);     // returns a NEW date\nboolean overdue = due.isBefore(today);    // false\n\nDuration call = Duration.ofMinutes(90);\nInstant start = Instant.now();\nInstant end   = start.plus(call);          // immutable arithmetic')+
    "<p>Every type is <strong>immutable</strong>: <span class='key'>plusDays</span> returns a new value, like Strings. That makes them thread-safe and predictable. Format with <span class='key'>DateTimeFormatter</span> (ISO-8601 by default), and store machine timestamps as <span class='key'>Instant</span>, human appointments as <span class='key'>ZonedDateTime</span>.</p>",
  stages:[{t:'LocalDate',s:'date only',c:'cyan'},{t:'LocalDateTime',s:'+ time',c:'purple'},{t:'Duration',s:'an amount',c:'amber'},{t:'ZonedDateTime',s:'+ zone',c:'emerald'},{t:'format',s:'ISO text',c:'coral'}],
  stepH2:'Build up from a date to a zoned, formatted time',
  stepIntro:'Step through the java.time types from the simplest date to a fully zoned, formatted timestamp — each one immutable.',
  steps:[
    {n:0, cap:'We need to represent “when” without the old Date/Calendar pitfalls.'},
    {n:1, cap:'<b>LocalDate</b> captures a calendar date — year-month-day, no time, no zone.'},
    {n:2, cap:'<b>LocalDateTime</b> adds a wall-clock time, still without a zone.'},
    {n:3, cap:'A <b>Duration</b> (or Period) represents an amount of time you can add or subtract.'},
    {n:4, cap:'<b>ZonedDateTime</b> pins it to a time zone, handling DST correctly.'},
    {n:5, cap:'A <b>DateTimeFormatter</b> renders it as ISO-8601 (or a custom pattern) text.'},
  ],
  playH2:'Immutable date arithmetic', playFile:'DateTime.java',
  playIntro:'plusDays returns a new date and leaves the original alone. Model the day math.',
  playCode:'// LocalDate.of(...).plusDays(5) returns a NEW date\nint startDay = 10;      // day-of-month\nint added    = 5;\nint endDay   = startDay + added;   // plusDays(5)\nSystem.out.println("start day-of-month = " + startDay);\nSystem.out.println("after plusDays(5)  = " + endDay);\nSystem.out.println("original unchanged = " + startDay);\nSystem.out.println("end after start? " + (endDay > startDay));',
  callouts:[
    {lang:'python', body:"<span class='key'>LocalDate</span>/<span class='key'>LocalDateTime</span> ≈ <span class='key'>datetime.date</span>/<span class='key'>datetime</span>, and <span class='key'>Duration</span> ≈ <span class='key'>timedelta</span>. Java's types are immutable (Python's are too) and the zone handling via <span class='key'>ZonedDateTime</span> is more explicit than mixing naive and aware datetimes."},
    {lang:'js', body:"Forget the awful legacy <span class='key'>Date</span> — java.time is what the new <b>Temporal</b> proposal is reaching for. Immutable, typed by concept (date vs instant vs zoned), with real arithmetic instead of millisecond math."},
    {lang:'csharp', body:"<span class='key'>LocalDate</span>/<span class='key'>LocalDateTime</span> ≈ <span class='key'>DateOnly</span>/<span class='key'>DateTime</span>, <span class='key'>Instant</span> ≈ <span class='key'>DateTimeOffset</span> (UTC), <span class='key'>Duration</span> ≈ <span class='key'>TimeSpan</span>. If you've used NodaTime, java.time will feel like its sibling — same designer's lineage."},
  ],
  exercises:[
    {h3:'Pick the type', prompt:"You're recording the exact moment a server handled a request, to compare across machines. <span class='key'>LocalDateTime</span> or <span class='key'>Instant</span>?",
     hint:"<b>Instant</b> — a zone-free point on the UTC timeline, ideal for machine timestamps and cross-machine comparison. <span class='key'>LocalDateTime</span> has no zone, so two of them from different regions aren't comparable."},
    {h3:'Did it mutate?', prompt:"<span class='key'>LocalDate d = ...; d.plusDays(7);</span> then you print <span class='key'>d</span>. Why is it unchanged?",
     hint:"java.time types are immutable — <span class='key'>plusDays</span> returns a <em>new</em> date and you ignored it. Capture the result: <span class='key'>d = d.plusDays(7);</span>."},
  ],
};

// ───────────────────────── 20 Annotations & Reflection ─────────────────────────
CONTENT['20'] = {
  num:'20', slug:'annotations-reflection', title:'Annotations & Reflection', navShort:'Annotations', track:T3,
  heroTitle:'Metadata the code can <span class="grad">read about itself</span>',
  lede:"Annotations attach metadata to code; reflection reads classes, fields, and methods at runtime. Together they power the frameworks you'll actually use — Spring, JUnit, Jackson — which wire things up by inspecting your annotated types.",
  conceptH2:'Tags on code, and an API to inspect them',
  conceptHtml:
    "<p>An <strong>annotation</strong> like <span class='key'>@Override</span> or <span class='key'>@Test</span> is metadata. Its <span class='key'>@Retention</span> says how long it survives: <span class='key'>SOURCE</span> (compiler only), <span class='key'>CLASS</span> (in bytecode), or <span class='key'>RUNTIME</span> (readable while running). <strong>Reflection</strong> is the API that reads types at runtime and can act on those annotations.</p>"+
    cb('@Retention(RetentionPolicy.RUNTIME)\n@interface Json { String name(); }     // a custom annotation\n\nclass User { @Json(name = "full_name") String name; }\n\n// A framework reads it reflectively\nfor (Field f : User.class.getDeclaredFields()) {\n    Json j = f.getAnnotation(Json.class);\n    if (j != null) System.out.println(f.getName() + " -> " + j.name());\n}')+
    "<p>This is how a serializer maps <span class='key'>name</span> to <span class='key'>\"full_name\"</span>, how JUnit finds <span class='key'>@Test</span> methods, and how Spring injects beans — all without you wiring it by hand. Reflection is powerful but slower and bypasses compile-time checks, so use it through frameworks, not as a default tool.</p>",
  stages:[{t:'@Json',s:'annotation',c:'amber'},{t:'@Retention',s:'how long it lives',c:'purple'},{t:'getClass()',s:'reflection',c:'cyan'},{t:'read fields',s:'+ annotations',c:'emerald'},{t:'invoke',s:'act on it',c:'coral'}],
  stepH2:'How a framework wires your class',
  stepIntro:'Step through what a library like Jackson or JUnit does: read your annotated class reflectively, then act on what it finds.',
  steps:[
    {n:0, cap:'You annotate a plain class and hand it to a framework — no wiring code of your own.'},
    {n:1, cap:'An <b>annotation</b> like <span class="key">@Json</span> tags a field with metadata.'},
    {n:2, cap:'Its <b>@Retention(RUNTIME)</b> keeps it readable while the program runs.'},
    {n:3, cap:'The framework uses <b>reflection</b> — <span class="key">User.class</span> — to inspect the type.'},
    {n:4, cap:'It walks the <b>fields</b> and reads each one’s annotations.'},
    {n:5, cap:'Acting on what it found, it <b>invokes</b> getters or sets values — serialization, injection, test discovery.'},
  ],
  playH2:'What reflection sees', playFile:'Reflect.java',
  playIntro:'Reflection enumerates a class’s members at runtime. Model a class with some fields and methods and total what it would report.',
  playCode:'// Reflectively inspecting a class\nint declaredFields  = 2;\nint declaredMethods = 3;\nint totalMembers = declaredFields + declaredMethods;\nSystem.out.println("fields  reflection sees = " + declaredFields);\nSystem.out.println("methods reflection sees = " + declaredMethods);\nSystem.out.println("total members = " + totalMembers);\nSystem.out.println("Frameworks read these to wire your app.");',
  callouts:[
    {lang:'python', body:"Reflection is Python's everyday <span class='key'>getattr</span>/<span class='key'>dir</span>/<span class='key'>inspect</span>, and annotations are like decorators plus <span class='key'>__annotations__</span>. Java's version is more ceremonious and type-checked, but the framework-magic use cases are identical."},
    {lang:'js', body:"Closest to JS decorators (TC39 / TypeScript) plus <span class='key'>Reflect</span> and <span class='key'>Object.keys</span>. Java annotations are declarative metadata read via a rich reflection API — the engine behind Spring/JUnit much like decorators power Angular/Nest."},
    {lang:'csharp', body:"Annotations are C# <b>attributes</b>, and reflection maps almost one-to-one (<span class='key'>typeof(T)</span>, <span class='key'>GetFields()</span>, <span class='key'>GetCustomAttribute</span>). If you've used attributes to drive serialization or DI in .NET, Java works the same way."},
  ],
  exercises:[
    {h3:'Why RUNTIME retention?', prompt:"Your custom annotation is read by a framework while the app runs, but it “isn't there” reflectively. What's the likely cause?",
     hint:"Its <span class='key'>@Retention</span> is the default (<span class='key'>CLASS</span>) or <span class='key'>SOURCE</span>, so it isn't kept for runtime. Add <span class='key'>@Retention(RetentionPolicy.RUNTIME)</span> so reflection can see it."},
    {h3:'Reflection has a cost', prompt:"Reflection can call any method by name at runtime. Name one downside that makes it a last resort for everyday code.",
     hint:"It bypasses compile-time type checking (errors surface at runtime), is slower than direct calls, and can break encapsulation. Great for frameworks; avoid it when a normal method call or interface would do."},
  ],
};

// ───────────────────────── 24 Dependency Injection & Spring ─────────────────────────
CONTENT['24'] = {
  num:'24', slug:'spring-di', title:'Dependency Injection & Spring', navShort:'Spring & DI', track:T5,
  heroTitle:'Don’t <span class="grad">new</span> your dependencies',
  lede:"Real Java apps rarely call new on their collaborators. Instead a container creates objects and hands each one what it needs — dependency injection. Spring is the framework that popularized it, and understanding the pattern matters more than memorizing its annotations.",
  conceptH2:'Inversion of control: the container wires you up',
  conceptHtml:
    "<p>Without DI, a class builds its own dependencies — <span class='key'>new EmailService()</span> — hard-wiring one implementation and making it untestable. With DI, the class declares what it needs (ideally an <em>interface</em>) and receives it, usually through its <strong>constructor</strong>. Who supplies it? The <strong>container</strong>.</p>"+
    cb('@Component\nclass OrderService {\n    private final Notifier notifier;          // depends on an interface\n    OrderService(Notifier notifier) {          // constructor injection\n        this.notifier = notifier;\n    }\n}\n\n@Component class EmailNotifier implements Notifier {}\n// Spring scans for @Component beans and injects EmailNotifier automatically.')+
    "<p>Spring scans for beans (<span class='key'>@Component</span>, <span class='key'>@Service</span>…), builds a dependency graph, and constructs everything in order into an <strong>application context</strong>. Because <span class='key'>OrderService</span> depends on the <span class='key'>Notifier</span> interface, a test can inject a fake — that swappability is the whole point. Prefer constructor injection over field injection: it makes dependencies explicit and objects immutable.</p>",
  stages:[{t:'@Component',s:'declare bean',c:'cyan'},{t:'scan',s:'find beans',c:'amber'},{t:'resolve',s:'graph deps',c:'purple'},{t:'inject',s:'constructor',c:'emerald'},{t:'context',s:'app ready',c:'coral'}],
  stepH2:'How Spring assembles your app',
  stepIntro:'Step through what the container does at startup: discover beans, work out who needs whom, and wire them together.',
  steps:[
    {n:0, cap:'Your classes declare their dependencies but never create them.'},
    {n:1, cap:'Each class is marked a <b>bean</b> with <span class="key">@Component</span> (or @Service, @Repository).'},
    {n:2, cap:'At startup Spring <b>scans</b> the classpath and finds every bean.'},
    {n:3, cap:'It <b>resolves</b> the dependency graph — which bean needs which other beans.'},
    {n:4, cap:'It constructs each bean, <b>injecting</b> collaborators through their constructors.'},
    {n:5, cap:'The fully wired <b>application context</b> is ready to serve requests.'},
  ],
  playH2:'Why injection beats new', playFile:'Wiring.java',
  playIntro:'Depending on an interface lets you swap implementations (real, fake, mock). Model how many you can plug in.',
  playCode:'// Hard-wired with new: exactly one implementation\nint hardWired = 1;\n// Injected via an interface: real, fake, and mock all fit\nint injectable = 3;\nSystem.out.println("hard-wired implementations = " + hardWired);\nSystem.out.println("injectable implementations = " + injectable);\nSystem.out.println("more swappable (better for tests)? " + (injectable > hardWired));',
  callouts:[
    {lang:'python', body:"Python leans on duck typing and simple constructor arguments, with frameworks like FastAPI offering <span class='key'>Depends</span>. Spring is heavier and annotation-driven, but the core idea — pass dependencies in rather than constructing them — is identical."},
    {lang:'js', body:"Closest to Angular's or NestJS's DI containers (which were Spring-inspired). Plain Node usually wires modules by hand; Spring automates that graph for you, resolving and constructing beans in dependency order."},
    {lang:'csharp', body:"Almost a direct map to .NET's built-in <span class='key'>IServiceCollection</span> DI: register services, inject via constructor. <span class='key'>@Component</span>/<span class='key'>@Service</span> ≈ <span class='key'>AddScoped</span>/<span class='key'>AddSingleton</span> registrations."},
  ],
  exercises:[
    {h3:'Why constructor injection?', prompt:"Spring supports field injection (<span class='key'>@Autowired</span> on a field) and constructor injection. Why do teams prefer the constructor?",
     hint:"Constructor injection makes dependencies explicit and required, allows <span class='key'>final</span> (immutable) fields, and lets you instantiate the class in a plain unit test with <span class='key'>new</span> — no Spring needed. Field injection hides dependencies and needs reflection to set up in tests."},
    {h3:'Depend on what?', prompt:"Should <span class='key'>OrderService</span> depend on <span class='key'>EmailNotifier</span> (a class) or <span class='key'>Notifier</span> (an interface)? Why does it matter for testing?",
     hint:"On the <b>interface</b>. That lets the container inject the real <span class='key'>EmailNotifier</span> in production and a fake/mock in tests, with no change to <span class='key'>OrderService</span>. Depending on the concrete class re-couples you to one implementation."},
  ],
};

// ───────────────────────── 25 Databases: JDBC & JPA ─────────────────────────
CONTENT['25'] = {
  num:'25', slug:'persistence-jdbc', title:'Databases: JDBC & JPA', navShort:'Persistence', track:T5,
  heroTitle:'From <span class="grad">SQL rows</span> to Java objects',
  lede:"Every backend talks to a database. JDBC is Java's low-level driver API; JPA/Hibernate is the high-level mapping that turns rows into objects. Both rest on one non-negotiable rule: never build SQL with string concatenation.",
  conceptH2:'JDBC underneath, JPA on top',
  conceptHtml:
    "<p>JDBC's flow: get a <span class='key'>Connection</span> from a pooled <span class='key'>DataSource</span>, run a <strong><span class='key'>PreparedStatement</span></strong> with <span class='key'>?</span> placeholders, read a <span class='key'>ResultSet</span>, and map each row to an object. The placeholders aren't a convenience — they're how you stop SQL injection.</p>"+
    cb('// JDBC — note the parameterized query and try-with-resources\nvar sql = "SELECT name FROM users WHERE id = ?";\ntry (var ps = conn.prepareStatement(sql)) {\n    ps.setInt(1, userId);                  // safe: never string-concat\n    try (var rs = ps.executeQuery()) {\n        while (rs.next()) use(rs.getString("name"));\n    }\n}\n\n// JPA — the same idea, mapped to an entity\n@Entity class User { @Id Long id; String name; }\nUser u = entityManager.find(User.class, userId);')+
    "<p>JPA/Hibernate maps <span class='key'>@Entity</span> classes to tables and generates the SQL for you, including lazy loading and caching. It's productive but leaky — you still need to understand the SQL it emits (watch for the N+1 query problem). Use JDBC (or a thin layer like jOOQ/Spring Data JDBC) when you want control; use JPA when you want speed of development.</p>",
  stages:[{t:'DataSource',s:'pool',c:'cyan'},{t:'Connection',s:'borrow',c:'amber'},{t:'PreparedStatement',s:'? params',c:'purple'},{t:'ResultSet',s:'rows',c:'emerald'},{t:'map',s:'to objects',c:'coral'}],
  stepH2:'A query from pool to object',
  stepIntro:'Step through one safe query: borrow a connection, bind parameters, read rows, and map them — releasing resources along the way.',
  steps:[
    {n:0, cap:'We need one user row from the database, by id.'},
    {n:1, cap:'A pooled <b>DataSource</b> hands out connections so we don’t open one per query.'},
    {n:2, cap:'We borrow a <b>Connection</b> (and return it via try-with-resources when done).'},
    {n:3, cap:'A <b>PreparedStatement</b> with a <span class="key">?</span> placeholder binds the id safely — no SQL injection.'},
    {n:4, cap:'Executing yields a <b>ResultSet</b> we iterate row by row.'},
    {n:5, cap:'Each row is <b>mapped</b> to a Java object (by hand in JDBC, automatically in JPA).'},
  ],
  playH2:'Reading a result set', playFile:'Query.java',
  playIntro:'A result set is rows × columns. Model how many cells a query reads and whether it returned anything.',
  playCode:'// SELECT returns rows; each row has columns\nint rows    = 3;\nint columns = 4;\nint cellsRead = rows * columns;\nSystem.out.println("rows returned = " + rows);\nSystem.out.println("cells read    = " + cellsRead);\nSystem.out.println("result has rows? " + (rows > 0));',
  callouts:[
    {lang:'python', body:"JDBC is Python's DB-API (<span class='key'>cursor.execute(sql, params)</span>) — same parameterized-query discipline. JPA/Hibernate ≈ SQLAlchemy ORM: productive object mapping, with the same need to mind the SQL it generates."},
    {lang:'js', body:"JDBC's <span class='key'>PreparedStatement</span> is the parameterized query you'd write with <span class='key'>pg</span>/<span class='key'>mysql2</span>; JPA/Hibernate plays the role of Prisma/TypeORM. The placeholder-not-concatenation rule is identical across all of them."},
    {lang:'csharp', body:"JDBC ≈ ADO.NET (<span class='key'>SqlConnection</span>, <span class='key'>SqlCommand</span> with parameters), and JPA/Hibernate ≈ Entity Framework. If you've used Dapper for control or EF for convenience, the JDBC-vs-JPA trade-off will feel familiar."},
  ],
  exercises:[
    {h3:'The injection trap', prompt:"Why is <span class='key'>\"...WHERE id = \" + userId</span> dangerous, and how does <span class='key'>PreparedStatement</span> fix it?",
     hint:"String-concatenating user input lets an attacker inject SQL (e.g. <span class='key'>1 OR 1=1</span>). A <span class='key'>PreparedStatement</span> sends the SQL and the parameter separately, so the value is always treated as data, never executable SQL."},
    {h3:'N+1 surprise', prompt:"With JPA, looping over 100 orders and reading each order's customer fires 101 queries. What's this called, and one way to avoid it?",
     hint:"The N+1 query problem — one query for the list, then one per item for the association. Fix it with an eager <span class='key'>JOIN FETCH</span> (or a batch/entity-graph) so the customers load in a single query."},
  ],
};

// ───────────────────────── 26 JSON with Jackson ─────────────────────────
CONTENT['26'] = {
  num:'26', slug:'json-jackson', title:'JSON with Jackson', navShort:'JSON', track:T5,
  heroTitle:'Java objects <span class="grad">⇄</span> JSON',
  lede:"APIs speak JSON; Java speaks objects. Jackson's ObjectMapper bridges the two — serialize a POJO to a JSON string, parse a string back into a typed object. It's the quiet workhorse under nearly every Spring REST endpoint.",
  conceptH2:'ObjectMapper: one object, two directions',
  conceptHtml:
    "<p>Jackson reads your class's fields (via getters or directly) and emits a JSON object — and the reverse, constructing an instance from JSON. Annotations tune the mapping: <span class='key'>@JsonProperty</span> renames a field, <span class='key'>@JsonIgnore</span> hides one.</p>"+
    cb('record User(\n    @JsonProperty("full_name") String name,\n    int age) {}\n\nObjectMapper mapper = new ObjectMapper();\nString json = mapper.writeValueAsString(new User("Ada", 36));\n// -> {"full_name":"Ada","age":36}\n\nUser back = mapper.readValue(json, User.class);   // parse it back')+
    "<p>Serialization walks the object graph to text; deserialization matches JSON keys to constructor parameters or fields. Reuse a single configured <span class='key'>ObjectMapper</span> (it's thread-safe and expensive to create), register the <span class='key'>jackson-datatype-jsr310</span> module for <span class='key'>java.time</span> types, and fail fast on unknown fields only when you mean to.</p>",
  stages:[{t:'POJO / record',s:'object',c:'cyan'},{t:'ObjectMapper',s:'configured',c:'amber'},{t:'writeValue',s:'serialize',c:'purple'},{t:'JSON text',s:'{ ... }',c:'emerald'},{t:'readValue',s:'deserialize',c:'coral'}],
  stepH2:'A round trip through JSON',
  stepIntro:'Step through serializing an object to JSON and parsing it back — the exact path a request body takes in a REST app.',
  steps:[
    {n:0, cap:'We have a typed Java object we want to send over the wire.'},
    {n:1, cap:'It’s a plain <b>POJO or record</b> with named fields.'},
    {n:2, cap:'A reusable <b>ObjectMapper</b> holds the configuration (naming, modules, date handling).'},
    {n:3, cap:'<b>writeValueAsString</b> serializes the object, honoring @JsonProperty renames.'},
    {n:4, cap:'Out comes <b>JSON text</b> — keys and values ready to send.'},
    {n:5, cap:'On the way in, <b>readValue</b> deserializes JSON back into a typed object.'},
  ],
  playH2:'Fields become keys', playFile:'Json.java',
  playIntro:'Each object field maps to one JSON key, and a round trip preserves them. Model the count.',
  playCode:'// Serializing a record with 3 components\nint fields  = 3;\nint jsonKeys = fields;        // one key per field\nSystem.out.println("object fields = " + fields);\nSystem.out.println("JSON keys     = " + jsonKeys);\nSystem.out.println("round-trips back intact? " + (jsonKeys == fields));',
  callouts:[
    {lang:'python', body:"Jackson is Java's heavier, type-driven cousin of <span class='key'>json.dumps</span>/<span class='key'>loads</span> or Pydantic. The big difference: deserialization is into a <em>typed</em> class, so <span class='key'>readValue(json, User.class)</span> gives you a checked <span class='key'>User</span>, not a loose dict."},
    {lang:'js', body:"Where JS has built-in <span class='key'>JSON.stringify</span>/<span class='key'>parse</span> producing untyped objects, Jackson maps to and from declared classes. <span class='key'>@JsonProperty</span> ≈ telling a serializer the wire name; the typing is what you'd add with Zod or class-transformer."},
    {lang:'csharp', body:"Jackson ≈ System.Text.Json / Newtonsoft. <span class='key'>@JsonProperty</span> ≈ <span class='key'>[JsonPropertyName]</span>, <span class='key'>@JsonIgnore</span> ≈ <span class='key'>[JsonIgnore]</span>. Reusing one <span class='key'>ObjectMapper</span> mirrors reusing <span class='key'>JsonSerializerOptions</span>."},
  ],
  exercises:[
    {h3:'Name mismatch', prompt:"Your API must emit <span class='key'>\"full_name\"</span> but your field is <span class='key'>name</span>. What's the one-line fix?",
     hint:"Annotate the field/component with <span class='key'>@JsonProperty(\"full_name\")</span>. Jackson then uses that name on the wire while your Java code keeps the idiomatic <span class='key'>name</span>."},
    {h3:'Reuse the mapper', prompt:"Why is creating a <span class='key'>new ObjectMapper()</span> inside every request handler a bad idea?",
     hint:"<span class='key'>ObjectMapper</span> is thread-safe and relatively expensive to construct (it builds and caches serializers). Create one, configure it once, and share it — per-request creation wastes CPU and memory under load."},
  ],
};

// ───────────────────────── 27 The HTTP Client ─────────────────────────
CONTENT['27'] = {
  num:'27', slug:'http-client', title:'The HTTP Client (java.net.http)', navShort:'HTTP Client', track:T5,
  heroTitle:'Call a service the <span class="grad">modern</span> way',
  lede:"For years calling HTTP in Java meant the clunky HttpURLConnection or a third-party library. Java 11's java.net.http changed that: a clean, immutable HttpClient with synchronous and async sends, built right into the JDK.",
  conceptH2:'Client, request, response — with async built in',
  conceptHtml:
    "<p>Build one reusable <span class='key'>HttpClient</span>, describe the call with an immutable <span class='key'>HttpRequest</span>, then <span class='key'>send</span> it (blocking) or <span class='key'>sendAsync</span> (returns a <span class='key'>CompletableFuture</span>). The response carries a status code and a typed body via a <span class='key'>BodyHandler</span>.</p>"+
    cb('HttpClient client = HttpClient.newHttpClient();   // reuse this\nHttpRequest req = HttpRequest.newBuilder()\n    .uri(URI.create("https://api.example.com/users/1"))\n    .header("Accept", "application/json")\n    .GET()\n    .build();\n\nHttpResponse<String> res = client.send(req, BodyHandlers.ofString());\nif (res.statusCode() == 200) parse(res.body());\n\n// Non-blocking variant\nclient.sendAsync(req, BodyHandlers.ofString())\n      .thenApply(HttpResponse::body);')+
    "<p>Check <span class='key'>statusCode()</span> before trusting the body — a 4xx or 5xx still returns normally (no exception). The async path pairs naturally with virtual threads or <span class='key'>CompletableFuture</span> chains for calling many services at once. Treat <span class='key'>HttpClient</span> like a connection pool: create it once and share it.</p>",
  stages:[{t:'HttpClient',s:'reusable',c:'cyan'},{t:'HttpRequest',s:'build',c:'amber'},{t:'send',s:'sync / async',c:'purple'},{t:'HttpResponse',s:'status + body',c:'emerald'},{t:'parse',s:'JSON → object',c:'coral'}],
  stepH2:'One call, from client to parsed body',
  stepIntro:'Step through a GET request: build it, send it, check the status, and only then read the body.',
  steps:[
    {n:0, cap:'We want to fetch a resource from a remote service.'},
    {n:1, cap:'Create one reusable <b>HttpClient</b> — it manages connections for us.'},
    {n:2, cap:'Describe the call as an immutable <b>HttpRequest</b>: URI, method, headers.'},
    {n:3, cap:'<b>send</b> it synchronously, or <b>sendAsync</b> for a non-blocking CompletableFuture.'},
    {n:4, cap:'The <b>HttpResponse</b> arrives with a status code and a typed body.'},
    {n:5, cap:'Check the status, then <b>parse</b> the body (e.g. JSON via Jackson) into an object.'},
  ],
  playH2:'Reading a status code', playFile:'Http.java',
  playIntro:'Status ranges decide what to do: 2xx success, 4xx client error, 5xx server error. Model the checks.',
  playCode:'int status = 200;\nSystem.out.println("status = " + status);\nSystem.out.println("at least 200?      " + (status >= 200));\nSystem.out.println("below 300 (2xx ok)? " + (status < 300));\nSystem.out.println("client error (4xx)? " + (status >= 400));',
  callouts:[
    {lang:'python', body:"<span class='key'>HttpClient</span> is the JDK's answer to <span class='key'>requests</span>/<span class='key'>httpx</span>. <span class='key'>send</span> ≈ a blocking <span class='key'>requests.get</span>; <span class='key'>sendAsync</span> ≈ <span class='key'>httpx</span>'s async client. One difference: a non-2xx response doesn't raise — you check <span class='key'>statusCode()</span> yourself."},
    {lang:'js', body:"Very close to <span class='key'>fetch</span>: build a request, await a response, then read the body. Like <span class='key'>fetch</span>, a 404 is a <em>successful</em> call with a 404 status — no exception — so you must inspect the status code explicitly."},
    {lang:'csharp', body:"Almost a direct port of <span class='key'>HttpClient</span> in .NET, down to “create once and reuse.” <span class='key'>sendAsync</span> + <span class='key'>CompletableFuture</span> ≈ <span class='key'>SendAsync</span> + <span class='key'>Task</span>. Same advice: don't new up a client per request."},
  ],
  exercises:[
    {h3:'No exception on 404', prompt:"You call an endpoint that returns 404 and your code reads <span class='key'>res.body()</span> as if it succeeded. What did you forget?",
     hint:"To check <span class='key'>res.statusCode()</span> first. The client returns normally for 4xx/5xx — it doesn't throw — so the body may be an error page or empty. Branch on the status before trusting the body."},
    {h3:'Sync or async?', prompt:"You must call 50 independent services and combine the results. Which send method, and why?",
     hint:"<span class='key'>sendAsync</span> — fire all 50 as <span class='key'>CompletableFuture</span>s so they run concurrently, then combine. Calling <span class='key'>send</span> (blocking) in a loop serializes them, taking the sum of all latencies. (Virtual threads make even the blocking style scale, but async composes the results cleanly.)"},
  ],
};

// ───────────────────────── 28 Logging Done Right ─────────────────────────
CONTENT['28'] = {
  num:'28', slug:'logging', title:'Logging Done Right', navShort:'Logging', track:T5,
  heroTitle:'println is not a <span class="grad">logging strategy</span>',
  lede:"In production you can't attach a debugger — logs are how you see what happened. Java's ecosystem settled on SLF4J as a facade over backends like Logback. Levels, parameterized messages, and structure separate useful logs from noise.",
  conceptH2:'A facade, levels, and lazy messages',
  conceptHtml:
    "<p>Code against the <strong>SLF4J</strong> facade (<span class='key'>Logger</span>, <span class='key'>LoggerFactory</span>); pick a backend (Logback, Log4j2) at deploy time. Each message has a <strong>level</strong> — ERROR, WARN, INFO, DEBUG, TRACE — and a configured threshold drops anything less severe.</p>"+
    cb('private static final Logger log =\n    LoggerFactory.getLogger(OrderService.class);\n\nlog.info("placed order {} for user {}", orderId, userId);  // {} params\nlog.debug("cart contents: {}", cart);    // skipped unless DEBUG enabled\ntry { ... } catch (Exception e) {\n    log.error("order {} failed", orderId, e);   // last arg = the exception\n}')+
    "<p>Use <span class='key'>{}</span> placeholders, not string concatenation: the message is only formatted if the level is enabled, so a disabled <span class='key'>debug</span> call costs almost nothing. Log the <em>exception object</em> (last argument) to capture the stack trace, never log secrets or PII, and prefer structured/JSON logs so tools can search them.</p>",
  stages:[{t:'LoggerFactory',s:'get logger',c:'cyan'},{t:'level',s:'INFO / DEBUG',c:'amber'},{t:'{} params',s:'lazy format',c:'purple'},{t:'appender',s:'file / console',c:'emerald'},{t:'filter',s:'by threshold',c:'coral'}],
  stepH2:'How a log line is decided and emitted',
  stepIntro:'Step through what happens when you call log.debug(...) — including why it can cost almost nothing.',
  steps:[
    {n:0, cap:'Something noteworthy happens and we want a record of it.'},
    {n:1, cap:'A static <b>Logger</b> is obtained once per class from LoggerFactory.'},
    {n:2, cap:'The call carries a <b>level</b> (say DEBUG) compared against the configured threshold.'},
    {n:3, cap:'With <b>{} parameters</b>, the message is only formatted if that level is enabled — lazy and cheap.'},
    {n:4, cap:'If enabled, an <b>appender</b> writes it to console, a file, or a log aggregator.'},
    {n:5, cap:'A <b>filter/threshold</b> drops lower-severity lines so production logs stay signal-rich.'},
  ],
  playH2:'Levels and thresholds', playFile:'Logging.java',
  playIntro:'Levels have a severity order; a threshold shows messages at or above it. Model which lines survive an INFO threshold.',
  playCode:'// Severity: ERROR=5 WARN=4 INFO=3 DEBUG=2 TRACE=1\nint threshold = 3;     // configured at INFO\nint debug = 2;\nint error = 5;\nSystem.out.println("DEBUG shown at INFO? " + (debug >= threshold));   // false\nSystem.out.println("ERROR shown at INFO? " + (error >= threshold));   // true\nSystem.out.println("Below the threshold is filtered out.");',
  callouts:[
    {lang:'python', body:"SLF4J + Logback ≈ the <span class='key'>logging</span> module: <span class='key'>getLogger(__name__)</span>, levels, handlers. SLF4J's <span class='key'>{}</span> placeholders are like <span class='key'>logger.info(\"%s\", x)</span> lazy formatting — the string is built only if the level is on."},
    {lang:'js', body:"A step up from <span class='key'>console.log</span> toward Winston/Pino. The SLF4J facade lets you swap backends without touching call sites, and levels + thresholds give you the production filtering raw <span class='key'>console</span> lacks."},
    {lang:'csharp', body:"SLF4J is the <span class='key'>ILogger</span> abstraction; Logback/Log4j2 ≈ Serilog/NLog providers. Parameterized <span class='key'>log.info(\"{}\", x)</span> mirrors structured logging's <span class='key'>Log.Information(\"{X}\", x)</span> — message template now, values captured separately."},
  ],
  exercises:[
    {h3:'Why {} not +?', prompt:"What's the difference between <span class='key'>log.debug(\"cart: \" + cart)</span> and <span class='key'>log.debug(\"cart: {}\", cart)</span> when DEBUG is disabled?",
     hint:"The first always builds the string (calling <span class='key'>cart.toString()</span>) even though it's discarded — wasted work. The <span class='key'>{}</span> form skips formatting entirely when DEBUG is off, so it's essentially free."},
    {h3:'Capture the trace', prompt:"In a catch block you write <span class='key'>log.error(\"failed: \" + e.getMessage())</span>. What valuable thing did you lose?",
     hint:"The stack trace. Pass the exception as the last argument instead: <span class='key'>log.error(\"failed for order {}\", orderId, e)</span>. SLF4J then logs the full trace, which <span class='key'>getMessage()</span> alone discards."},
  ],
};

module.exports = { NAV, CONTENT };
