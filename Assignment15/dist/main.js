"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    id;
    name;
    email;
    password;
    phone;
    _age;
    constructor(id, name, email, password, phone, age) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this._age = age;
        void this.password;
    }
    get age() {
        return this._age;
    }
    set age(value) {
        if (value >= 18 && value <= 60) {
            this._age = value;
        }
        else {
            console.error("Age must be between 18 and 60.");
        }
    }
    displayInfo() {
        console.log(`User ID: ${this.id}`);
        console.log(`Name: ${this.name}`);
        console.log(`Email: ${this.email}`);
        console.log(`Phone: ${this.phone}`);
        console.log(`Age: ${this.age}`);
    }
}
class Storage {
    items = [];
    addItem(item) {
        this.items.push(item);
    }
    removeItem(item) {
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
            return true;
        }
        return false;
    }
    getAllItems() {
        return [...this.items];
    }
}
class Note {
    id;
    title;
    content;
    userId;
    constructor(id, title, content, userId) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.userId = userId;
    }
    preview() {
        const maxLength = 50;
        if (this.content.length > maxLength) {
            return this.content.substring(0, maxLength) + '...';
        }
        return this.content;
    }
}
class NoteBook {
    notes = [];
    addNote(note) {
        this.notes.push(note);
    }
    removeNote(noteId) {
        const index = this.notes.findIndex(note => note.id === noteId);
        if (index > -1) {
            this.notes.splice(index, 1);
            return true;
        }
        return false;
    }
    getNotes() {
        return [...this.notes];
    }
}
class Admin extends User {
    constructor(id, name, email, password, phone, age) {
        super(id, name, email, password, phone, age);
    }
    manageNotes() {
        console.log(`Admin ${this.name} is managing notes.`);
    }
}
class AggregatedUser extends User {
    notebooks = [];
    constructor(id, name, email, password, phone, age) {
        super(id, name, email, password, phone, age);
    }
    addNotebook(notebook) {
        this.notebooks.push(notebook);
    }
    removeNotebook(notebook) {
        const index = this.notebooks.indexOf(notebook);
        if (index > -1) {
            this.notebooks.splice(index, 1);
            return true;
        }
        return false;
    }
}
console.log("--- Part A Examples ---");
const numberStorage = new Storage();
numberStorage.addItem(10);
numberStorage.addItem(20);
console.log("Numbers in storage:", numberStorage.getAllItems());
const user1 = new User(1, "maria rizk", "maria@example.com", "password123", "+1234567890", 28);
const admin1 = new Admin(2, "Bob Smith", "bob@admin.com", "adminPass456", "+0987654321", 35);
user1.displayInfo();
admin1.displayInfo();
admin1.manageNotes();
const note1 = new Note(101, "Meeting Notes", "Discussed project timeline and deliverables...", user1.id);
const note2 = new Note(102, "Shopping List", "Milk, Eggs, Bread, Fruits", user1.id);
const note3 = new Note(103, "System Update", "Applied security patches to servers.", admin1.id);
console.log("Note Preview:", note1.preview());
const notebook1 = new NoteBook();
const notebook2 = new NoteBook();
notebook1.addNote(note1);
notebook1.addNote(note2);
notebook2.addNote(note3);
console.log("Notes in Notebook 1:", notebook1.getNotes().map(n => n.title));
console.log("Notes in Notebook 2:", notebook2.getNotes().map(n => n.title));
notebook1.removeNote(101);
console.log("Notes in Notebook 1 after removal:", notebook1.getNotes().map(n => n.title));
const aggUser1 = new AggregatedUser(3, "Charlie Brown", "charlie@example.com", "pass789", "+1122334455", 25);
aggUser1.addNotebook(notebook1);
aggUser1.addNotebook(notebook2);
console.log(`${aggUser1.name} has ${aggUser1.notebooks.length} notebooks.`);
aggUser1.removeNotebook(notebook2);
console.log(`${aggUser1.name} now has ${aggUser1.notebooks.length} notebooks.`);
console.log("\n--- Part B UML Relationships ---");
console.log("1. Inheritance: Admin extends User (IS-A relationship)");
console.log("2. Composition: NoteBook contains Note objects (HAS-A relationship, strong ownership)");
console.log("3. Aggregation: User has a collection of NoteBook objects (HAS-A relationship, weak ownership)");
console.log("4. Association: Note references a User via userId (USE-A relationship)");
