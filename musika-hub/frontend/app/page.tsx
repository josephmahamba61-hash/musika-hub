const featuredProducts = [
  { name: 'Industrial 3D Printer', category: 'Manufacturing', price: '$28,000', stock: 12 },
  { name: 'High-Pressure Pump', category: 'Fluid Systems', price: '$3,800', stock: 26 },
  { name: 'Automation Sensor Kit', category: 'Automation', price: '$1,250', stock: 54 }
]

const featuredSuppliers = [
  { name: 'Quotinet Metals', location: 'Colombo', specialty: 'Steel Fabrication' },
  { name: 'NexGen Systems', location: 'Kandy', specialty: 'Automation & Controls' },
  { name: 'Precision Machining Co.', location: 'Gampaha', specialty: 'CNC Components' }
]

const featuredServices = [
  { name: 'Project Engineering', description: 'Complete technical scoping, estimation and delivery.' },
  { name: 'Site Installation', description: 'On-site commissioning for industrial systems.' },
  { name: 'Digital Twin Modeling', description: 'Simulation, optimization and predictive maintenance.' }
]

const categories = [
  'Machinery',
  'Automation',
  'Civil Works',
  'Electrical',
  'Piping',
  'Consulting'
]

const testimonials = [
  { name: 'Ravi Kumar', role: 'Procurement Lead', quote: 'MUSIKA HUB helped us find qualified suppliers fast and simplified vendor selection.' },
  { name: 'Anjali Rodrigo', role: 'Operations Manager', quote: 'The platform feels industrial-grade with a polished experience for engineering teams.' },
  { name: 'Suresh Perera', role: 'Supplier Partner', quote: 'We expanded our client base and received better quality inquiries through MUSIKA HUB.' }
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-navy text-slate-100">
      <header className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-steel">MUSIKA HUB</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Engineering procurement reimagined for suppliers, service providers, and enterprises.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-steel">
              Connect with trusted engineering manufacturers, contractors, and industrial service teams across Sri Lanka and beyond.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a href="#search" className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-blue-500">
                Explore Marketplace
              </a>
              <a href="#suppliers" className="inline-flex items-center justify-center rounded-full border border-steel/40 px-7 py-3 text-sm font-semibold text-white/90 transition hover:border-white/60 hover:text-white">
                Browse Suppliers
              </a>
            </div>
          </div>
          <div className="rounded-[2rem] bg-slate-900/90 p-8 shadow-glow backdrop-blur-xl md:w-[420px]">
            <p className="text-sm uppercase tracking-[0.25em] text-steel">Fast search for engineering solutions</p>
            <div className="mt-6 flex gap-3 rounded-3xl bg-navy p-4 shadow-inner">
              <input type="search" placeholder="Search machinery, consultants, services..." className="w-full bg-transparent text-sm text-white outline-none placeholder:text-steel" />
              <button className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500">Search</button>
            </div>
            <div className="mt-6 grid gap-3 text-sm text-steel">
              <span>Trusted network of engineering suppliers</span>
              <span>Verified service providers</span>
              <span>Industrial grade product catalogue</span>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-glow">
            <h2 className="text-xl font-semibold text-white">Featured products</h2>
            <p className="mt-3 text-sm text-steel">Industrial stock, pricing transparency and technical catalogues in one place.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-glow">
            <h2 className="text-xl font-semibold text-white">Featured suppliers</h2>
            <p className="mt-3 text-sm text-steel">Verified engineering vendors with company profiles and ratings.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-glow">
            <h2 className="text-xl font-semibold text-white">Featured services</h2>
            <p className="mt-3 text-sm text-steel">Technical services, project execution, installation and consulting.</p>
          </div>
        </div>
      </section>

      <section id="products" className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-steel">Products</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">High-value industrial inventory</h2>
          </div>
          <a href="#search" className="text-sm font-semibold text-accent transition hover:text-blue-400">View all products →</a>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {featuredProducts.map((product) => (
            <article key={product.name} className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-glow transition hover:-translate-y-1 hover:border-accent/30">
              <div className="mb-4 h-48 rounded-3xl bg-gradient-to-br from-slate-800 to-navy"></div>
              <p className="text-sm text-steel">{product.category}</p>
              <h3 className="mt-3 text-xl font-semibold text-white">{product.name}</h3>
              <div className="mt-4 flex items-center justify-between text-sm text-steel">
                <span>{product.price}</span>
                <span>{product.stock} in stock</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="suppliers" className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-steel">Supplier directory</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Verified companies and engineering partners</h2>
            <p className="mt-4 max-w-xl text-base leading-8 text-steel">
              Find suppliers with company profiles, product catalogues, and service offerings built for industrial procurement.
            </p>
          </div>
          <div className="space-y-4">
            {featuredSuppliers.map((supplier) => (
              <div key={supplier.name} className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-glow">
                <p className="text-sm text-steel">{supplier.location}</p>
                <h3 className="mt-2 text-xl font-semibold text-white">{supplier.name}</h3>
                <p className="mt-3 text-sm leading-6 text-steel">Specialty: {supplier.specialty}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-steel">Services</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Engineering services for every stage</h2>
          </div>
          <a href="#suppliers" className="text-sm font-semibold text-accent transition hover:text-blue-400">Contact providers →</a>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {featuredServices.map((service) => (
            <article key={service.name} className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-glow hover:border-accent/30">
              <h3 className="text-xl font-semibold text-white">{service.name}</h3>
              <p className="mt-4 text-sm leading-7 text-steel">{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-10 shadow-glow">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-steel">Categories</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Explore marketplace categories</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-steel">Search and filter products, suppliers, and services by industry category and engineering specialization.</p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((item) => (
              <div key={item} className="rounded-3xl border border-white/10 bg-navy/80 p-4 text-center text-sm font-semibold text-white transition hover:border-accent/40 hover:bg-slate-900">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="mx-auto max-w-7xl px-6 py-12">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-steel">Testimonials</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Trusted by engineering teams and suppliers</h2>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-glow">
              <p className="text-lg leading-8 text-steel">“{item.quote}”</p>
              <div className="mt-6 border-t border-white/10 pt-5 text-sm text-steel">
                <p className="font-semibold text-white">{item.name}</p>
                <p>{item.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 bg-navy/90 px-6 py-10 text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-base font-semibold text-white">MUSIKA HUB</p>
            <p className="mt-2 max-w-md text-sm text-steel">A professional industrial marketplace for engineering suppliers, contractors, manufacturers, and enterprise customers.</p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-steel">
            <span>About</span>
            <span>Services</span>
            <span>Suppliers</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
