export interface Requester {
  id: string;
  displayName: string;
  department: string;
  hospital: string;
  initials: string;
  role: "doctor" | "coordinator" | "admin";
}

export const CURRENT_USER: Requester = {
  id: "user-priya",
  displayName: "Dr. Priya Mehta",
  department: "Cardiothoracic Surgery",
  hospital: "Mount Sinai West",
  initials: "PM",
  role: "coordinator",
};

export const CLINICIANS: Requester[] = [
  CURRENT_USER,
  { id: "user-james", displayName: "Dr. James Okafor", department: "Emergency Medicine", hospital: "Mount Sinai West", initials: "JO", role: "doctor" },
  { id: "user-mei", displayName: "Dr. Mei Chen", department: "Pediatric Surgery", hospital: "Mount Sinai West", initials: "MC", role: "doctor" },
  { id: "user-ravi", displayName: "Dr. Ravi Patel", department: "Anesthesiology", hospital: "Mount Sinai West", initials: "RP", role: "doctor" },
  { id: "user-sofia", displayName: "Dr. Sofia Alvarez", department: "Trauma Surgery", hospital: "Mount Sinai West", initials: "SA", role: "doctor" },
  { id: "user-liam", displayName: "Dr. Liam O'Brien", department: "Orthopedic Surgery", hospital: "Mount Sinai West", initials: "LO", role: "doctor" },
  { id: "user-aisha", displayName: "Dr. Aisha Rahman", department: "Infectious Disease", hospital: "Mount Sinai West", initials: "AR", role: "doctor" },
];
