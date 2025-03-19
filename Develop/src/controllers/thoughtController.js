import {User, Thought} from '../models/index.js';

// GET all Thoughts
export const getAllThoughts = async (req, res) => {
    try {
        const thoughts = await Thought.find();
        res.json(thoughts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch thoughts' });
    }
};

// GET a single Thought by its _id
export const getThoughtById = async (req, res) => {
    try {
        const thought = await Thought.findOne({ _id: req.params.id });
        if (!thought) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
        }
        res.json(thought);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch thought' });
    }
};

// POST a new Thought
// Dont forget to push the created thought's _id to the associated user's thoughts array field
export const createThought = async (req, res) => {
    try {
      const thought = await Thought.create(req.body);
      const thoughtId = thought._id;
      await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { thoughts: thoughtId } },
        { new: true }
      );
      res.json(thought);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create thought' });
    }
  };
// PUT to update a Thought by its _id
// PUT to update a Thought
export const updateThought = async (req, res) => {
    try {
        const thought = await Thought.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
        if (!thought) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
        }
        res.json(thought);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update thought' });
    }
}

// DELETE to remove Thought by its _id
export const deleteThought = async (req, res) => {
    try {
        const thoughtId = req.params.id;
        const thought = await Thought.findOneAndDelete({ _id: thoughtId });
        if (!thought) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
        }
        res.json({ message: 'Thought deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete thought' });
    }
}
// POST to create a reaction stored in a single Thought's reactions array field
export const addReaction = async (req, res) => {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { new: true }
        );
        if (!thought) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
        }
        res.json(thought);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add reaction' });
}}

// DELETE to pull and remove a reaction by the reaction's reactionId value
export const removeReaction = async (req, res) => {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true }
        );
        if (!thought) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
        }
        res.json(thought);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to remove reaction' });
    }
}