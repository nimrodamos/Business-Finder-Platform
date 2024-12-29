export interface Owner {
  name: string;
  email: string;
}

export interface Business {
  _id: string;
  name: string;
  description: string;
  category: string;
  subscribers: string[];
  owner: Owner;
  createdAt: string;
  updatedAt: string;
}
