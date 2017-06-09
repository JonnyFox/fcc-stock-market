export interface Identity {
    id: string;
    name: string;
    email: string;
    imageUrl: string;
}

export class User {
    name: string;
    surname: string;
    age: number;
}

export class Poll {
    _id?: string;
    authorId: string;
    name: string;
    options: string[];
    votes: number[];
}