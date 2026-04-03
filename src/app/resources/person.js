const person = {
  firstName: "Joe",
  lastName: "Lanzi",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "AI Engineer · Data Scientist · Investor",
  avatar: "/images/avatar.jpg",
  location: "America/Chicago",
  languages: [],
};

export { person };
