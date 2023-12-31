import { useState } from 'react';
import { v4 as uuid } from 'uuid';
const initialFriends = [
  {
    id: 118836,
    name: 'Clark',
    image: 'https://i.pravatar.cc/48?u=118836',
    balance: -7,
  },
  {
    id: 933372,
    name: 'Sarah',
    image: 'https://i.pravatar.cc/48?u=933372',
    balance: 20,
  },
  {
    id: 499476,
    name: 'Anthony',
    image: 'https://i.pravatar.cc/48?u=499476',
    balance: 0,
  },
];

const Button = ({ children, onClick }) => {
  return (
    <button className='button' onClick={onClick}>
      {children}
    </button>
  );
};

const App = () => {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const showAddFriendHandler = () => {
    setShowAddFriend((currentState) => {
      return !showAddFriend;
    });
  };

  const handleAddFriend = (friend) => {
    setFriends((currentFriends) => [...friends, friend]);
    setShowAddFriend(false);
  };

  const handleSelection = (friend) => {
    setSelectedFriend((selected) =>
      selected?.id === friend.id ? null : friend
    );
    setShowAddFriend(false);
  };

  const handleSplitBill = (value) => {
    setFriends((currentFriends) =>
      currentFriends.map((friend) => {
        return friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend;
      })
    );
    setSelectedFriend(null);
  };

  return (
    <div className='app'>
      <div className='sidebar'>
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={showAddFriendHandler}>
          {showAddFriend ? 'Close' : 'Add Friend'}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
          key={selectedFriend.id}
        />
      )}
    </div>
  );
};

const FriendsList = ({ friends, onSelection, selectedFriend }) => {
  return (
    <ul>
      {friends.map((friend) => {
        return (
          <Friend
            friend={friend}
            key={friend.id}
            onSelection={onSelection}
            selectedFriend={selectedFriend}
          />
        );
      })}
    </ul>
  );
};

const Friend = ({ friend, onSelection, selectedFriend }) => {
  const isSelected = friend.id === selectedFriend?.id;

  return (
    <li className={isSelected ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance > 0 && (
        <p className='green'>
          {friend.name} owes you ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance < 0 && (
        <p className='red'>
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even.</p>}
      <Button className='button' onClick={() => onSelection(friend)}>
        {isSelected ? 'Close' : 'Select'}
      </Button>
    </li>
  );
};

const FormAddFriend = ({ onAddFriend }) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState('https://i.pravatar.cc/48');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name || !image) {
      return;
    }

    const id = crypto.randomUUID();
    const newFriend = {
      name,
      image: `${image}?=${id}`,
      balance: 0,
      id,
    };

    onAddFriend(newFriend);

    setName('');
    setImage('https://i.pravatar.cc/48');
  };

  return (
    <form className='form-add-friend' onSubmit={handleSubmit}>
      <label>👫🏼 Friend Name</label>
      <input
        type='text'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🏞️ Image URL</label>
      <input
        type='text'
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button className='button'>Add</Button>
    </form>
  );
};

const FormSplitBill = ({ friend, selectedFriend, onSplitBill }) => {
  const [billTotal, setBillTotal] = useState('');
  const [userBill, setUserBill] = useState('');
  const [whoIsPaying, setWhoIsPaying] = useState('user');

  const paidByFriend = billTotal ? Number(billTotal - userBill) : '';

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!billTotal || !userBill) return;

    onSplitBill(whoIsPaying === 'user' ? paidByFriend : -userBill);
  };

  return (
    <form className='form-split-bill' onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💸 Bill Amount</label>
      <input
        type='text'
        value={billTotal}
        onChange={(e) => setBillTotal(Number(e.target.value))}
      />

      <label>🧍🏼‍♂️ Your expense</label>
      <input
        type='text'
        value={userBill}
        onChange={(e) =>
          setUserBill(
            Number(e.target.value) > billTotal
              ? userBill
              : Number(e.target.value)
          )
        }
      />

      <label>👫🏼 {selectedFriend.name}'s expense</label>
      <input type='text' value={paidByFriend} disabled />

      <label> 🤑 Who is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}>
        <option value='user'>You</option>
        <option value='friend'>{selectedFriend.name}</option>
      </select>

      <Button className='button'>Split Bill</Button>
    </form>
  );
};

export default App;
