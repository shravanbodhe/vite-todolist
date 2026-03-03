import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App Component', () => {
  beforeEach(() => {
    render(<App />);
  });

  describe('Initial Render', () => {
    it('should render the todo input field', () => {
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('');
    });

    it('should render the Add button', () => {
      const addButton = screen.getByRole('button', { name: /add/i });
      expect(addButton).toBeInTheDocument();
    });

    it('should render the "Add To DO Item here" label', () => {
      expect(screen.getByText(/Add To DO Item here/i)).toBeInTheDocument();
    });

    it('should render the "TO Do List" heading', () => {
      expect(screen.getByText(/TO Do List/i)).toBeInTheDocument();
    });

    it('should render an empty todo list initially', () => {
      const listItems = screen.queryAllByRole('listitem');
      expect(listItems).toHaveLength(0);
    });
  });

  describe('Adding Todos', () => {
    it('should add a new todo item when Add button is clicked', async () => {
      const user = userEvent.setup();
      const input = screen.getByRole('textbox');
      const addButton = screen.getByRole('button', { name: /add/i });

      await user.type(input, 'Buy groceries');
      await user.click(addButton);

      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    });

    it('should clear the input field after adding a todo', async () => {
      const user = userEvent.setup();
      const input = screen.getByRole('textbox');
      const addButton = screen.getByRole('button', { name: /add/i });

      await user.type(input, 'Buy groceries');
      await user.click(addButton);

      expect(input).toHaveValue('');
    });

    it('should add multiple todo items', async () => {
      const user = userEvent.setup();
      const input = screen.getByRole('textbox');
      const addButton = screen.getByRole('button', { name: /add/i });

      await user.type(input, 'First task');
      await user.click(addButton);

      await user.type(input, 'Second task');
      await user.click(addButton);

      await user.type(input, 'Third task');
      await user.click(addButton);

      expect(screen.getByText('First task')).toBeInTheDocument();
      expect(screen.getByText('Second task')).toBeInTheDocument();
      expect(screen.getByText('Third task')).toBeInTheDocument();
    });

    it('should not add empty todo items', async () => {
      const user = userEvent.setup();
      const addButton = screen.getByRole('button', { name: /add/i });

      await user.click(addButton);

      const listItems = screen.queryAllByRole('listitem');
      expect(listItems).toHaveLength(0);
    });

    it('should not add todo items with only whitespace', async () => {
      const user = userEvent.setup();
      const input = screen.getByRole('textbox');
      const addButton = screen.getByRole('button', { name: /add/i });

      await user.type(input, '   ');
      await user.click(addButton);

      const listItems = screen.queryAllByRole('listitem');
      expect(listItems).toHaveLength(0);
    });
  });

  describe('Deleting Todos', () => {
    it('should delete a todo item when Delete button is clicked', async () => {
      const user = userEvent.setup();
      const input = screen.getByRole('textbox');
      const addButton = screen.getByRole('button', { name: /add/i });

      await user.type(input, 'Task to delete');
      await user.click(addButton);

      expect(screen.getByText('Task to delete')).toBeInTheDocument();

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      await user.click(deleteButton);

      expect(screen.queryByText('Task to delete')).not.toBeInTheDocument();
    });

    it('should delete the correct todo when multiple todos exist', async () => {
      const user = userEvent.setup();
      const input = screen.getByRole('textbox');
      const addButton = screen.getByRole('button', { name: /add/i });

      await user.type(input, 'First task');
      await user.click(addButton);

      await user.type(input, 'Second task');
      await user.click(addButton);

      await user.type(input, 'Third task');
      await user.click(addButton);

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[1]); // Delete second task

      expect(screen.getByText('First task')).toBeInTheDocument();
      expect(screen.queryByText('Second task')).not.toBeInTheDocument();
      expect(screen.getByText('Third task')).toBeInTheDocument();
    });
  });

  describe('Editing Todos', () => {
    it('should enable edit mode when Edit button is clicked', async () => {
      const user = userEvent.setup();
      const input = screen.getByRole('textbox');
      const addButton = screen.getByRole('button', { name: /add/i });

      await user.type(input, 'Task to edit');
      await user.click(addButton);

      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      const textboxes = screen.getAllByRole('textbox');
      expect(textboxes).toHaveLength(2); // Original input + edit input
      expect(textboxes[1]).toHaveValue('Task to edit');
    });

    it('should update todo text when editing', async () => {
      const user = userEvent.setup();
      const input = screen.getByRole('textbox');
      const addButton = screen.getByRole('button', { name: /add/i });

      await user.type(input, 'Original text');
      await user.click(addButton);

      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      const textboxes = screen.getAllByRole('textbox');
      const editInput = textboxes[1];

      await user.clear(editInput);
      await user.type(editInput, 'Updated text');

      expect(editInput).toHaveValue('Updated text');
    });

    it('should save edited todo when Save button is clicked', async () => {
      const user = userEvent.setup();
      const input = screen.getByRole('textbox');
      const addButton = screen.getByRole('button', { name: /add/i });

      await user.type(input, 'Original text');
      await user.click(addButton);

      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      const textboxes = screen.getAllByRole('textbox');
      const editInput = textboxes[1];

      await user.clear(editInput);
      await user.type(editInput, 'Updated text');

      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);

      expect(screen.getByText('Updated text')).toBeInTheDocument();
      expect(screen.queryByText('Original text')).not.toBeInTheDocument();
    });

    it('should exit edit mode after saving', async () => {
      const user = userEvent.setup();
      const input = screen.getByRole('textbox');
      const addButton = screen.getByRole('button', { name: /add/i });

      await user.type(input, 'Task to edit');
      await user.click(addButton);

      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);

      const textboxes = screen.getAllByRole('textbox');
      expect(textboxes).toHaveLength(1); // Only the main input should remain
    });
  });

  describe('Input Field Behavior', () => {
    it('should update input value when typing', async () => {
      const user = userEvent.setup();
      const input = screen.getByRole('textbox');

      await user.type(input, 'New task');

      expect(input).toHaveValue('New task');
    });

    it('should handle special characters in todo text', async () => {
      const user = userEvent.setup();
      const input = screen.getByRole('textbox');
      const addButton = screen.getByRole('button', { name: /add/i });

      const specialText = 'Task with @#$% special chars!';
      await user.type(input, specialText);
      await user.click(addButton);

      expect(screen.getByText(specialText)).toBeInTheDocument();
    });
  });

  describe('Todo List Rendering', () => {
    it('should render all action buttons for each todo item', async () => {
      const user = userEvent.setup();
      const input = screen.getByRole('textbox');
      const addButton = screen.getByRole('button', { name: /add/i });

      await user.type(input, 'Test task');
      await user.click(addButton);

      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });

    it('should maintain todo order when adding items', async () => {
      const user = userEvent.setup();
      const input = screen.getByRole('textbox');
      const addButton = screen.getByRole('button', { name: /add/i });

      await user.type(input, 'First');
      await user.click(addButton);

      await user.type(input, 'Second');
      await user.click(addButton);

      await user.type(input, 'Third');
      await user.click(addButton);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems[0]).toHaveTextContent('First');
      expect(listItems[1]).toHaveTextContent('Second');
      expect(listItems[2]).toHaveTextContent('Third');
    });
  });
});
