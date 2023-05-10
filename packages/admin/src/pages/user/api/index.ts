const url = '/api/user';

export interface User {
  _id: string;
  phoneNumber: string;
  password: string;
  name?: string;
  avatar?: string;
  email?: string;
  job?: string;
  jobName?: string;
  organization?: string;
  location?: string;
  personalWebsite?: string;
}
export const initial = {
  _id: '',
  phoneNumber: '',
  password: '',
  name: '',
  avatar: '',
  email: '',
  job: '',
  jobName: '',
  organization: '',
  location: '',
  personalWebsite: ''
};

export function updateUser(id: string, data: Partial<User>) {
  return fetch(`${url}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  }).then((res) => res.json());
}

export function addUser(data: Partial<User>): Promise<User> {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  }).then((res) => res.json());
}
