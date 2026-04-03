import MediaCard from './MediaCard';

export default function MediaGrid({ media }) {
  if (!media?.length) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
      {media.map((item, i) => (
        <MediaCard key={item.id} media={item} index={i} />
      ))}
    </div>
  );
}
