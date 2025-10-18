export default function Gallery() {
  return (
    // no extra top padding so it sits right under the header
    <section className="pt-6 pb-12">
      {/* smaller width + slight left offset */}
      <div className="max-w-4xl mx-0 ml-6 sm:ml-10 md:ml-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="bg-gradient-to-r from-gray-200 to-gray-700 rounded-md h-28"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
