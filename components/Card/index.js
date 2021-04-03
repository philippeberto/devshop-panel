const Card = ({ children }) => {
  return (
    <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-white">
      {children}
    </div>
  );
};

const CardIcon = ({ children }) => {
  return (
    <div className="p-3 rounded-full bg-indigo-600 bg-opacity-75">
      {children}
    </div>

  );
};

const CardData = ({ children }) => {
  return (
    <div className="mx-5">{children}</div>
  );
};

const CardTitle = ({ children }) => {
  return (
    <h4 className="text-2xl font-semibold text-gray-700">{children}</h4>

  );
};

const CardDescription = ({ children }) => {
  return (
    <div className="text-gray-500">{children}</div>

  );
};

Card.Icon = CardIcon;
Card.Data = CardData;
Card.Title = CardTitle;
Card.Description = CardDescription;


export default Card;