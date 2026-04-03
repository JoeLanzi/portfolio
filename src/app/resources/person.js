const person = {
  firstName: "Joe",
  lastName: "Lanzi",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "AI Engineer Â· Data Scientist Â· Investor",
  avatar: "/images/avatar.jpg",
  location: "America/Chicago",
  languages: [],
};

export { person };
