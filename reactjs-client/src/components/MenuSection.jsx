// MenuSection.jsx
function MenuSection({ title, items }) {
    return (
      <section className="menu-section">
        <h2>{title}</h2>
        <div className="menu-items">
          {items.map((item, index) => (
            <div key={index} className="menu-item">
              <div className="menu-item-header">
                <h3>{item.name}</h3>
                <span className="price">${item.price.toFixed(2)}</span>
              </div>
              <p className="description">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }
  
  export default MenuSection;