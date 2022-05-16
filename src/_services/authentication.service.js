import { BehaviorSubject } from 'rxjs';
import axiosClient from "../api/axiosClient";

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const authenticationService = {
    signup,
    login,
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue() { return currentUserSubject.value }
};

async function signup(username, password, firstname, lastname) {
    const userInfo = { username, password, firstname, lastname };
    const lastID = await axiosClient.post('/users/signup', userInfo);
    // console.log("lastID: ", lastID);
    return lastID;
}

async function login(username, password) {
    let user = [];
    const userInfo = { username, password };
    try {
        user = await axiosClient.post('/users/login', userInfo);
        localStorage.setItem('currentUser', JSON.stringify(user));
        currentUserSubject.next(user);
        // console.log("user: ", user);
    } catch (error) {
        console.log("error: ", error);
    }
    return user;
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}
