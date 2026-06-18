import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import Sortable from 'sortablejs';
import { Tasks } from '../api/tasks.js';
import './App.html';

// Create reactive variables
const filter = new ReactiveVar('');
const showHideCompleted = new ReactiveVar(false);

Template.mainContainer.onCreated(function() {
  this.subscribe('tasks');
});

Template.mainContainer.helpers({
  tasks() {
    const filterValue = filter.get();
    const showCompleted = showHideCompleted.get();

    let query = {};

    // Apply category filter
    if (filterValue && filterValue !== 'completed') {
      query.category = filterValue;
    }

    // Apply completed filter
    if (filterValue === 'completed') {
      query.checked = true;
    } else if (!showCompleted) {
      query.checked = false;
    }

    // Sort by order (drag-and-drop order)
    return Tasks.find(query, { sort: { order: 1 } });
  },

  completedCount() {
    return Tasks.find({ checked: true }).count();
  },

  remainingCount() {
    return Tasks.find({ checked: false }).count();
  },

  filter() {
    return filter.get();
  },

  showHideCompleted() {
    return showHideCompleted.get();
  },
});

Template.mainContainer.events({
  'keyup .new-task-input'(event) {
    if (event.key === 'Enter') {
      const text = event.target.value.trim();
      const categorySelect = document.querySelector('.new-task-category');
      const category = categorySelect.value;

      if (text && category) {
        Meteor.call('tasks.insert', text, category, (error) => {
          if (error) {
            alert(`Error: ${error.reason}`);
          } else {
            event.target.value = '';
            categorySelect.value = '';
          }
        });
      } else {
        alert('Please enter a task and select a category.');
      }
    }
  },

  'click .add-task-btn'(event) {
    event.preventDefault();
    const input = document.querySelector('.new-task-input');
    const categorySelect = document.querySelector('.new-task-category');
    const text = input.value.trim();
    const category = categorySelect.value;

    if (text && category) {
      Meteor.call('tasks.insert', text, category, (error) => {
        if (error) {
          alert(`Error: ${error.reason}`);
        } else {
          input.value = '';
          categorySelect.value = '';
        }
      });
    } else {
      alert('Please enter a task and select a category.');
    }
  },

  'click .filter-btn'(event) {
    const filterValue = event.target.getAttribute('data-filter');
    if (filterValue === 'completed') {
      showHideCompleted.set(!showHideCompleted.get());
    } else {
      filter.set(filterValue);
      showHideCompleted.set(false);
    }
  },
});

Template.mainContainer.onRendered(function() {
  // Initialize SortableJS for drag-and-drop
  const tasksList = document.getElementById('tasks-list');
  
  if (tasksList) {
    Sortable.create(tasksList, {
      animation: 150,
      ghostClass: 'task-ghost',
      dragClass: 'task-dragging',
      group: 'tasks',
      onEnd: (event) => {
        const taskElements = Array.from(tasksList.querySelectorAll('[data-id]'));
        
        taskElements.forEach((element, index) => {
          const taskId = element.getAttribute('data-id');
          const task = Tasks.findOne(taskId);
          
          // Only update if the order actually changed
          if (task && task.order !== index) {
            Meteor.call('tasks.updateOrder', taskId, index);
          }
        });
      },
    });
  }

  // Re-initialize when tasks list changes
  this.autorun(() => {
    Tasks.find().fetch(); // Trigger re-computation when tasks change
    Meteor.setTimeout(() => {
      const updatedTasksList = document.getElementById('tasks-list');
      if (updatedTasksList && Sortable.get(updatedTasksList)) {
        // SortableJS is already attached, Blaze will handle the reordering
      }
    }, 100);
  });
});

// Task template helpers and events
Template.task.helpers({
  checked() {
    return this.checked ? 'checked' : '';
  },
});

Template.task.events({
  'change .task-checkbox'(event) {
    Meteor.call('tasks.setChecked', this._id, event.target.checked, (error) => {
      if (error) {
        alert(`Error: ${error.reason}`);
      }
    });
  },

  'click .task-delete'(event) {
    event.preventDefault();
    if (confirm('Are you sure you want to delete this task?')) {
      Meteor.call('tasks.remove', this._id, (error) => {
        if (error) {
          alert(`Error: ${error.reason}`);
        }
      });
    }
  },
});
