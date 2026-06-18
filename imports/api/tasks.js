import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

// Create the Tasks collection
export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
  // Deny all client-side updates (security)
  Tasks.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
  });

  // Publish tasks for the current user
  Meteor.publish('tasks', function tasksPublication() {
    if (!this.userId) {
      return this.ready();
    }
    return Tasks.find({ userId: this.userId });
  });
}

// Define Meteor methods for database operations
Meteor.methods({
  // Insert a new task
  'tasks.insert'(text, category) {
    // Validate inputs
    check(text, String);
    check(category, String);

    // Check user is logged in
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to create a task');
    }

    // Validate category
    const validCategories = ['Work', 'Personal', 'Urgent'];
    if (!validCategories.includes(category)) {
      throw new Meteor.Error('invalid-category', `Category must be one of: ${validCategories.join(', ')}`);
    }

    // Get the next order number
    const lastTask = Tasks.findOne(
      { userId: Meteor.userId() },
      { sort: { order: -1 }, limit: 1 }
    );
    const nextOrder = lastTask ? lastTask.order + 1 : 0;

    // Insert the task
    return Tasks.insert({
      text,
      category,
      order: nextOrder,
      checked: false,
      createdAt: new Date(),
      userId: Meteor.userId(),
    });
  },

  // Remove a task
  'tasks.remove'(taskId) {
    check(taskId, String);

    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized', 'You must be logged in');
    }

    const task = Tasks.findOne(taskId);
    if (!task) {
      throw new Meteor.Error('not-found', 'Task not found');
    }

    // Check ownership
    if (task.userId !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized', 'You can only delete your own tasks');
    }

    return Tasks.remove(taskId);
  },

  // Set checked status
  'tasks.setChecked'(taskId, isChecked) {
    check(taskId, String);
    check(isChecked, Boolean);

    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized', 'You must be logged in');
    }

    const task = Tasks.findOne(taskId);
    if (!task) {
      throw new Meteor.Error('not-found', 'Task not found');
    }

    // Check ownership
    if (task.userId !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized', 'You can only update your own tasks');
    }

    return Tasks.update(taskId, {
      $set: { checked: isChecked },
    });
  },

  // Update task order (for drag-and-drop)
  'tasks.updateOrder'(taskId, newOrder) {
    check(taskId, String);
    check(newOrder, Number);

    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized', 'You must be logged in');
    }

    const task = Tasks.findOne(taskId);
    if (!task) {
      throw new Meteor.Error('not-found', 'Task not found');
    }

    // Check ownership
    if (task.userId !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized', 'You can only reorder your own tasks');
    }

    return Tasks.update(taskId, {
      $set: { order: newOrder },
    });
  },

  // Update task text
  'tasks.setText'(taskId, newText) {
    check(taskId, String);
    check(newText, String);

    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized', 'You must be logged in');
    }

    const task = Tasks.findOne(taskId);
    if (!task) {
      throw new Meteor.Error('not-found', 'Task not found');
    }

    // Check ownership
    if (task.userId !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized', 'You can only update your own tasks');
    }

    return Tasks.update(taskId, {
      $set: { text: newText },
    });
  },

  // Update task category
  'tasks.setCategory'(taskId, newCategory) {
    check(taskId, String);
    check(newCategory, String);

    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized', 'You must be logged in');
    }

    const task = Tasks.findOne(taskId);
    if (!task) {
      throw new Meteor.Error('not-found', 'Task not found');
    }

    // Check ownership
    if (task.userId !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized', 'You can only update your own tasks');
    }

    // Validate category
    const validCategories = ['Work', 'Personal', 'Urgent'];
    if (!validCategories.includes(newCategory)) {
      throw new Meteor.Error('invalid-category', `Category must be one of: ${validCategories.join(', ')}`);
    }

    return Tasks.update(taskId, {
      $set: { category: newCategory },
    });
  },
});
