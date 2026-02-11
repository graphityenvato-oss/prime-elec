"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { PrimeCard } from "@/components/ui/prime-card";
import { supabaseClient } from "@/lib/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type MessageRow = {
  id: string;
  full_name: string;
  company: string | null;
  email: string;
  phone: string | null;
  part_number: string | null;
  quantity: string | null;
  details: string | null;
  read_at: string | null;
  created_at: string;
};

type BoqRow = {
  id: string;
  full_name: string;
  phone: string;
  project_name: string | null;
  notes: string | null;
  file_url: string;
  file_path: string;
  read_at: string | null;
  created_at: string;
};

export default function AdminDashboardPage() {
  const [checked, setChecked] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [activeMessage, setActiveMessage] = useState<MessageRow | null>(null);
  const [boqRequests, setBoqRequests] = useState<BoqRow[]>([]);
  const [boqLoading, setBoqLoading] = useState(false);
  const [boqError, setBoqError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const checkAdmin = async () => {
      const { data } = await supabaseClient.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        router.replace("/ns-admin");
        return;
      }

      const response = await fetch("/api/admin/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.isAdmin) {
        router.replace("/ns-admin");
        return;
      }

      if (isMounted) {
        setToken(token);
        setChecked(true);
      }
    };

    checkAdmin();

    return () => {
      isMounted = false;
    };
  }, [router]);

  useEffect(() => {
    if (!token) return;
    let isMounted = true;
    const run = async () => {
      await Promise.resolve();
      if (!isMounted) return;
      setMessagesLoading(true);
      setMessagesError(null);

      try {
        const response = await fetch("/api/admin/messages", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Failed to load messages.");
        }
        const result = (await response.json().catch(() => ({}))) as {
          messages?: MessageRow[];
        };
        if (isMounted) {
          setMessages(result.messages ?? []);
        }
      } catch (err) {
        if (isMounted) {
          setMessagesError(
            err instanceof Error ? err.message : "Failed to load messages.",
          );
        }
      } finally {
        if (isMounted) {
          setMessagesLoading(false);
        }
      }
    };

    void run();

    return () => {
      isMounted = false;
    };
  }, [token]);

  useEffect(() => {
    if (!token) return;
    let isMounted = true;
    const run = async () => {
      await Promise.resolve();
      if (!isMounted) return;
      setBoqLoading(true);
      setBoqError(null);

      try {
        const response = await fetch("/api/admin/boq", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Failed to load BOQ requests.");
        }
        const result = (await response.json().catch(() => ({}))) as {
          requests?: BoqRow[];
        };
        if (isMounted) {
          setBoqRequests(result.requests ?? []);
        }
      } catch (err) {
        if (isMounted) {
          setBoqError(
            err instanceof Error ? err.message : "Failed to load BOQ requests.",
          );
        }
      } finally {
        if (isMounted) {
          setBoqLoading(false);
        }
      }
    };

    void run();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const sortedMessages = useMemo(
    () =>
      [...messages].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
    [messages],
  );

  const toggleBoqRead = async (request: BoqRow) => {
    if (!token) return;
    const nextRead = !request.read_at;
    await fetch(`/api/admin/boq/${request.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ read: nextRead }),
    });
    setBoqRequests((current) =>
      current.map((item) =>
        item.id === request.id
          ? { ...item, read_at: nextRead ? new Date().toISOString() : null }
          : item,
      ),
    );
  };

  const deleteMessage = async (message: MessageRow) => {
    if (!token) return;
    const response = await fetch(`/api/admin/messages/${message.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      setMessagesError("Failed to delete message.");
      return;
    }
    setMessages((current) => current.filter((item) => item.id !== message.id));
    setActiveMessage(null);
  };

  if (!checked) {
    return null;
  }

  return (
    <>
      <section>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Dashboard
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Track orders, quotes, and incoming requests in one place.
        </p>
      </section>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="boq">BOQ</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Open Quotes", value: "24" },
              { label: "Active Orders", value: "12" },
              { label: "Pending Approvals", value: "6" },
              { label: "Low Stock", value: "9" },
            ].map((item) => (
              <PrimeCard key={item.label} className="p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-3 text-2xl font-extrabold">{item.value}</p>
              </PrimeCard>
            ))}
          </section>

          <PrimeCard className="p-6">
            <h2 className="text-lg font-semibold">Recent activity</h2>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Quote #Q-1421 sent to EV Systems Co.</span>
                <span>2h ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Order #A-0946 approved by procurement.</span>
                <span>5h ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Inventory alert: Breakers below threshold.</span>
                <span>Yesterday</span>
              </div>
            </div>
          </PrimeCard>
        </TabsContent>

        <TabsContent value="messages">
          <PrimeCard className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Messages</h2>
              <span className="text-xs text-muted-foreground">
                {messages.length} total
              </span>
            </div>

            <div className="mt-4">
              {messagesError ? (
                <div className="rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {messagesError}
                </div>
              ) : null}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messagesLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-sm">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : sortedMessages.length ? (
                    sortedMessages.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell className="font-medium">
                          {message.full_name}
                        </TableCell>
                        <TableCell>{message.email}</TableCell>
                        <TableCell>{message.company ?? "-"}</TableCell>
                        <TableCell>
                          {new Date(message.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {message.read_at ? "Read" : "New"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              className="rounded-full px-4"
                              onClick={() => setActiveMessage(message)}
                            >
                              View
                            </Button>
                            <Button
                              variant="outline"
                              className="rounded-full px-4"
                              onClick={() => void deleteMessage(message)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-sm">
                        No messages yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </PrimeCard>
        </TabsContent>

        <TabsContent value="boq">
          <PrimeCard className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">BOQ Requests</h2>
              <span className="text-xs text-muted-foreground">
                {boqRequests.length} total
              </span>
            </div>

            <div className="mt-4">
              {boqError ? (
                <div className="rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {boqError}
                </div>
              ) : null}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>File</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {boqLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-sm">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : boqRequests.length ? (
                    boqRequests.map((request) => (
                      <TableRow
                        key={request.id}
                        className={
                          request.read_at ? "bg-emerald-500/5" : undefined
                        }
                      >
                        <TableCell className="font-medium">
                          {request.full_name}
                        </TableCell>
                        <TableCell>{request.phone}</TableCell>
                        <TableCell>{request.project_name ?? "-"}</TableCell>
                        <TableCell className="max-w-60 truncate">
                          {request.notes ?? "-"}
                        </TableCell>
                        <TableCell>
                          {new Date(request.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {request.read_at ? "Read" : "New"}
                        </TableCell>
                        <TableCell>
                          <a
                            href={request.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Download BOQ"
                            className="inline-flex items-center justify-center rounded-full border border-primary/30 p-2 text-primary transition-colors duration-300 hover:border-primary hover:bg-primary/10 dark:text-white dark:border-white/30 dark:hover:border-white dark:hover:bg-white/10"
                          >
                            <Download className="size-4" />
                          </a>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            className="rounded-full px-4"
                            onClick={() => void toggleBoqRead(request)}
                          >
                            {request.read_at ? "Mark Unread" : "Mark Read"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-sm">
                        No BOQ requests yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </PrimeCard>
        </TabsContent>
      </Tabs>

      <Dialog
        open={Boolean(activeMessage)}
        onOpenChange={() => setActiveMessage(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message details</DialogTitle>
            <DialogDescription>
              {activeMessage?.full_name} •{" "}
              {activeMessage?.created_at
                ? new Date(activeMessage.created_at).toLocaleString()
                : ""}
            </DialogDescription>
          </DialogHeader>
          {activeMessage ? (
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Contact
                </p>
                <p>{activeMessage.email}</p>
                {activeMessage.phone ? <p>{activeMessage.phone}</p> : null}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Company
                </p>
                <p>{activeMessage.company ?? "-"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Part / Quantity
                </p>
                <p>{activeMessage.part_number ?? "-"}</p>
                <p>{activeMessage.quantity ?? "-"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Details
                </p>
                <p>{activeMessage.details ?? "-"}</p>
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveMessage(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
