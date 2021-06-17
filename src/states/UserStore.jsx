import { makeObservable, action, observable } from "mobx";

export class UserStore {
    rootStore;
    id = '';
    email = '';
    projects = {};

    constructor(root) {
        makeObservable(this, {
            id: observable,
            email: observable,
            projects: observable,
            setUserData:action,
        });

        this.rootStore = root;

    }

    setUserData({ id, email, projects }) {
        this.id = id !== undefined ? id : this.id;
        this.email = email !== undefined ? email : this.email;
        this.projects = projects !== undefined ? projects : this.projects;
    }
}