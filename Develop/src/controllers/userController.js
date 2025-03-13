import {User, Thought} from '../models/index.js';
// GET all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

// GET a single user by its _id and populated thought and friend data
export const getUserById = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id })
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .populate({
                path: 'friends',
                select: '-__v'
            });

        if (!user) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

// POST a new user
export const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Failed to create user' });
    }
};

// PUT to update a user by its _id
export const updateUser = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ _id: req.params.id
        }, req.body, { new: true });
        if (!user) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

// DELETE to remove user by its _id
// BONUS: Remove a user's associated thoughts when deleted
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ _id: req.params.id });    
        if (!user) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }
        await Thought.deleteMany({ username: user.username });
        res.json({ message: 'User and associated thoughts deleted!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};
// POST to add a new friend to a user's friend list
export const addFriend = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { new: true }
        );
        if (!user) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add friend' });
    }
};

// DELETE to remove a friend from a user's friend list
export const removeFriend = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { new: true }
        );
        if (!user) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to remove friend' });
    }
};