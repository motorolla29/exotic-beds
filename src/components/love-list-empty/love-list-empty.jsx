import './love-list-emty.sass';

function LoveListEmpty() {
  return (
    <div className="love-list">
      <b className="love-list_status">Nothing in your lovelist yet.</b>
      <p className="love-list_status-description">
        Сlick the heart icon on the product card to add item to your lovelist.
      </p>
    </div>
  );
}

export default LoveListEmpty;
