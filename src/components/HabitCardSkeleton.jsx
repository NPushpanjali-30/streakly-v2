import "./HabitCardSkeleton.css";

export default function HabitCardSkeleton() {
  return (
    <div className="habit-card-skeleton card">
      <div className="skel-top">
        <div className="skeleton skel-tag" />
        <div className="skeleton skel-checkbox" />
      </div>
      <div className="skeleton skel-name" />
      <div className="skel-streaks">
        <div className="skeleton skel-pill" />
        <div className="skeleton skel-pill" />
      </div>
    </div>
  );
}
