// 🚀 SISTEM SEKOLAH DIGITAL — ALL-IN-ONE (SINGLE FILE)
// Next.js + Tailwind + shadcn/ui + Recharts + Framer Motion + Supabase
//
// Menggabungkan: Landing Page, Admin Dashboard (sidebar + chart),
// E-Learning (Tugas / Nilai / Raport), Parent Dashboard (analytics),
// dan endpoint webhook WhatsApp Bot — tanpa duplikasi.

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ================= CONFIG =================
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://eivgfczwkejhwkeynpci.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdmdmY3p3a2VqaHdrZXlucGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwOTI5NzQsImV4cCI6MjA5MjY2ODk3NH0.pBsNuolSMGx0nCS54csHJ8NGXwQcHaqIB3soS3h6IQI"
);

// ================= HELPERS / HOOKS =================
function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const login = () => supabase.auth.signInWithOAuth({ provider: "google" });
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return { user, login, logout };
}

function useSchoolData() {
  const [news, setNews] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const refresh = async () => {
    const [{ data: n }, { data: a }, { data: s }] = await Promise.all([
      supabase.from("news").select("*").order("created_at", { ascending: false }),
      supabase.from("assignments").select("*").order("created_at", { ascending: false }),
      supabase.from("submissions").select("*"),
    ]);
    setNews(n || []);
    setAssignments(a || []);
    setSubmissions(s || []);
  };

  useEffect(() => {
    refresh();
  }, []);

  return { news, assignments, submissions, refresh };
}

// ================= MAIN APP =================
export default function App() {
  const [page, setPage] = useState("home"); // home | admin | elearning | parent
  const { user, login, logout } = useAuth();
  const data = useSchoolData();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        page={page}
        setPage={setPage}
        user={user}
        login={login}
        logout={logout}
      />

      {page === "home" && <HomePage data={data} />}
      {page === "admin" && <AdminDashboard user={user} data={data} />}
      {page === "elearning" && <ELearning user={user} data={data} />}
      {page === "parent" && <ParentDashboard />}

      <footer className="bg-gray-100 text-center p-4 text-sm">
        © sinpapay_p.TY 2026 SMPN 17 Tegal — Sistem Digital Sekolah
      </footer>
    </div>
  );
}

// ================= NAVBAR =================
function Navbar({ page, setPage, user, login, logout }) {
  const tabs = [
    { id: "home", label: "Beranda" },
    { id: "admin", label: "Admin" },
    { id: "elearning", label: "E-Learning" },
    { id: "parent", label: "Orang Tua" },
  ];

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow sticky top-0 z-10">
      <h1 className="text-xl font-bold text-blue-700">SMPN 17 Tegal</h1>
      <div className="flex gap-2 items-center">
        {tabs.map((t) => (
          <Button
            key={t.id}
            variant={page === t.id ? "default" : "ghost"}
            onClick={() => setPage(t.id)}
          >
            {t.label}
          </Button>
        ))}
        {!user ? (
          <Button onClick={login}>Login</Button>
        ) : (
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        )}
      </div>
    </nav>
  );
}

// ================= HOME / LANDING =================
function HomePage({ data }) {
  return (
    <>
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-3"
        >
          Portal Digital Sekolah
        </motion.h2>
        <p className="opacity-90">
          Sistem informasi, e-learning, dan akademik terintegrasi
        </p>
      </section>

      <section className="p-6 grid md:grid-cols-3 gap-4">
        <StatCard title="📚 Tugas Aktif" value={data.assignments.length} color="text-blue-600" />
        <StatCard title="📰 Berita" value={data.news.length} color="text-green-600" />
        <StatCard title="👨‍🎓 Siswa Aktif" value={120} color="text-purple-600" />
      </section>

      <section className="p-6">
        <h2 className="text-2xl font-bold mb-4">Berita Terbaru</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {data.news.map((n) => (
            <Card key={n.id} className="rounded-2xl shadow hover:shadow-lg transition">
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2">{n.title}</h3>
                <p className="text-sm text-gray-600">{n.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="p-6">
        <h2 className="text-2xl font-bold mb-4">Tugas Terbaru</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {data.assignments.map((a) => (
            <Card key={a.id} className="rounded-2xl shadow">
              <CardContent className="p-4">
                <h3 className="font-bold">{a.title}</h3>
                <p className="text-sm text-gray-600">{a.description}</p>
                <p className="text-xs text-red-500 mt-2">Deadline: {a.deadline}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}

// ================= ADMIN DASHBOARD =================
function AdminDashboard({ user, data }) {
  const { news, assignments, submissions } = data;

  const chartData = assignments.map((a) => ({
    name: a.title,
    jumlah: submissions.filter((s) => s.assignment_id === a.id).length,
  }));

  return (
    <div className="flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-lg p-5 min-h-[calc(100vh-72px)]">
        <h1 className="text-xl font-bold mb-6">Admin Panel</h1>
        <nav className="flex flex-col gap-3">
          <Button variant="ghost">Dashboard</Button>
          <Button variant="ghost">Berita</Button>
          <Button variant="ghost">Tugas</Button>
          <Button variant="ghost">Nilai</Button>
          <Button variant="ghost">Raport</Button>
          <Button variant="ghost">User</Button>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          {user && <span>Login: {user.email}</span>}
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <StatCard title="Total Berita" value={news.length} />
          <StatCard title="Total Tugas" value={assignments.length} />
          <StatCard title="Total Pengumpulan" value={submissions.length} />
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="mb-4 font-bold">Statistik Pengumpulan Tugas</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="jumlah" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-bold mb-2">Berita Terbaru</h3>
              {news.slice(0, 3).map((n) => (
                <p key={n.id}>• {n.title}</p>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h3 className="font-bold mb-2">Tugas Terbaru</h3>
              {assignments.slice(0, 3).map((a) => (
                <p key={a.id}>• {a.title}</p>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

// ================= E-LEARNING (TUGAS / NILAI / RAPORT) =================
function ELearning({ user, data }) {
  const { news, assignments, submissions, refresh } = data;

  const createAssignment = async (title, desc, deadline) => {
    await supabase
      .from("assignments")
      .insert([{ title, description: desc, deadline }]);
    refresh();
  };

  const submitTask = async (file, assignment_id) => {
    if (!file || !user) return;
    const fileName = `${Date.now()}_${file.name}`;
    await supabase.storage.from("tugas").upload(fileName, file);
    const { data: pub } = supabase.storage.from("tugas").getPublicUrl(fileName);
    await supabase
      .from("submissions")
      .insert([{ assignment_id, file_url: pub.publicUrl, user_id: user.id }]);
    refresh();
  };

  const giveGrade = async (id, score) => {
    await supabase.from("submissions").update({ score }).eq("id", id);
    refresh();
  };

  const report = useMemo(() => {
    const grouped = {};
    submissions.forEach((s) => {
      if (!grouped[s.user_id]) grouped[s.user_id] = [];
      grouped[s.user_id].push(s.score || 0);
    });
    return Object.keys(grouped).map((id) => {
      const scores = grouped[id];
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      return { user_id: id, avg: avg.toFixed(1) };
    });
  }, [submissions]);

  return (
    <main className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">🏫 E-Learning</h1>

      <Section title="📰 Berita">
        {news.map((n) => (
          <div key={n.id} className="mb-3">
            <h3 className="font-bold">{n.title}</h3>
            <p className="text-sm text-gray-600">{n.content}</p>
          </div>
        ))}
      </Section>

      <Section title="📚 Tugas">
        {assignments.map((a) => (
          <div key={a.id} className="mb-4 border-b pb-3">
            <h3 className="font-bold">{a.title}</h3>
            <p className="text-sm text-gray-600">{a.description}</p>
            {user && <SubmitForm onSubmit={(f) => submitTask(f, a.id)} />}
          </div>
        ))}
      </Section>

      <Section title="📊 Nilai">
        {submissions.map((s) => (
          <div key={s.id} className="flex items-center gap-3 mb-2">
            <a href={s.file_url} className="text-blue-600 underline" target="_blank" rel="noreferrer">
              File
            </a>
            <span>Nilai: {s.score ?? "-"}</span>
            {user && (
              <Button
                size="sm"
                onClick={() => {
                  const v = prompt("Nilai");
                  if (v !== null) giveGrade(s.id, Number(v));
                }}
              >
                Beri Nilai
              </Button>
            )}
          </div>
        ))}
      </Section>

      <Section title="📄 Raport">
        {report.map((r) => (
          <div key={r.user_id} className="mb-2">
            <p>
              Siswa: <strong>{r.user_id}</strong> — Rata-rata: {r.avg}
            </p>
          </div>
        ))}
      </Section>

      {user && <CreateAssignmentForm onCreate={createAssignment} />}
    </main>
  );
}

function CreateAssignmentForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [deadline, setDeadline] = useState("");

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <h3 className="font-bold">Buat Tugas</h3>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul" />
        <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Deskripsi" />
        <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        <Button
          onClick={() => {
            if (!title) return;
            onCreate(title, desc, deadline);
            setTitle("");
            setDesc("");
            setDeadline("");
          }}
        >
          Buat
        </Button>
      </CardContent>
    </Card>
  );
}

function SubmitForm({ onSubmit }) {
  const [file, setFile] = useState(null);
  return (
    <div className="flex gap-2 mt-2">
      <Input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <Button onClick={() => file && onSubmit(file)}>Kumpulkan</Button>
    </div>
  );
}

// ================= PARENT DASHBOARD =================
function ParentDashboard() {
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    (async () => {
      const { data: studentData } = await supabase
        .from("students")
        .select("*")
        .limit(1)
        .single();
      setStudent(studentData);

      if (studentData) {
        const { data: gradeData } = await supabase
          .from("submissions")
          .select("subject, score")
          .eq("user_id", studentData.id);
        setGrades(gradeData || []);
      }
    })();
  }, []);

  const subjectChart = useMemo(() => {
    const acc = grades.reduce((map, cur) => {
      if (!map[cur.subject]) map[cur.subject] = { subject: cur.subject, total: 0, count: 0 };
      map[cur.subject].total += cur.score || 0;
      map[cur.subject].count += 1;
      return map;
    }, {});
    return Object.values(acc).map((s) => ({
      subject: s.subject,
      avg: Number((s.total / s.count).toFixed(1)),
    }));
  }, [grades]);

  const overallAvg =
    subjectChart.length > 0
      ? (
          subjectChart.reduce((a, b) => a + b.avg, 0) / subjectChart.length
        ).toFixed(1)
      : 0;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard Orang Tua</h1>
        {student && (
          <p className="text-gray-600">
            {student.name} — Kelas {student.class}
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <StatCard title="📊 Rata-rata" value={overallAvg} />
        <StatCard title="📚 Jumlah Mapel" value={subjectChart.length} />
        <StatCard title="📝 Total Nilai" value={grades.length} />
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="font-bold mb-4">Rata-rata Nilai per Mapel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectChart}>
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avg" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="font-bold mb-4">Perkembangan Nilai</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={grades}>
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-bold mb-4">Detail Nilai</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left">Mapel</th>
                <th>Nilai</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((g, i) => (
                <tr key={i} className="border-b">
                  <td>{g.subject}</td>
                  <td className="text-center">{g.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

// ================= SHARED COMPONENTS =================
function StatCard({ title, value, color = "" }) {
  return (
    <Card className="rounded-2xl shadow">
      <CardContent className="p-4">
        <h3 className="text-sm">{title}</h3>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function Section({ title, children }) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-3">{title}</h2>
        {children}
      </CardContent>
    </Card>
  );
}

// ================= WHATSAPP BOT WEBHOOK (SERVER SIDE) =================
// File: pages/api/wa-webhook.js  (atau route handler Next.js)
//
// import { supabase } from "@/path/to/SchoolApp"; // pakai instance yang sama
//
// export async function webhook(req, res) {
//   const msg = req.body.message || "";
//   const sender = req.body.sender;
//
//   if (msg.startsWith("NILAI")) {
//     const id = msg.split(" ")[1];
//     const { data } = await supabase
//       .from("submissions")
//       .select("subject, score")
//       .eq("user_id", id);
//
//     let text = "📊 Nilai Siswa\n";
//     (data || []).forEach((d) => {
//       text += `${d.subject}: ${d.score}\n`;
//     });
//
//     await fetch("https://api.fonnte.com/send", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: process.env.FONNTE_TOKEN || "YOUR_TOKEN",
//       },
//       body: JSON.stringify({ target: sender, message: text }),
//     });
//   }
//
//   res.status(200).json({ ok: true });
// }

// ================= DATABASE SCHEMA (REFERENSI) =================
// Tables : news, assignments, submissions, students, parents
// Storage: bucket "tugas"
//
// news        (id, title, content, created_at)
// assignments (id, title, description, deadline, created_at)
// submissions (id, assignment_id, user_id, file_url, subject, score, created_at)
// students    (id, name, class, parent_id)
// parents     (id, name, phone, user_id)
