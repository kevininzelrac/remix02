/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node" />

/* interface Window {
  env: any;
} */

interface post {
  SK: string;
  label: string;
  category: string;
  author: string;
  date: string;
  content: string;
}

interface message {
  id: string;
  date: number;
  from: String;
  to: String;
  message: String;
  status: Boolean;
}

interface user {
  name: string;
}
