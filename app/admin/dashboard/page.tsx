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
import { ConfirmationAlert } from "@/components/ui/confirmation-alert";
import { toast } from "sonner";

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

type QuotationCartItem = {
  id: string;
  name: string;
  partNumber: string;
  codeNo?: string;
  quantity: number;
  source: "stock" | "external";
  brand?: string;
  category?: string;
};

type QuotationRow = {
  id: string;
  full_name: string;
  company: string | null;
  email: string;
  phone: string | null;
  project_notes: string | null;
  needs_consultation: boolean;
  cart_items: QuotationCartItem[];
  total_items: number;
  total_quantity: number;
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
  const [quotations, setQuotations] = useState<QuotationRow[]>([]);
  const [quotationsLoading, setQuotationsLoading] = useState(false);
  const [quotationsError, setQuotationsError] = useState<string | null>(null);
  const [activeQuotation, setActiveQuotation] = useState<QuotationRow | null>(
    null,
  );
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
      setQuotationsLoading(true);
      setQuotationsError(null);

      try {
        const response = await fetch("/api/admin/quotations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Failed to load quotation requests.");
        }
        const result = (await response.json().catch(() => ({}))) as {
          requests?: QuotationRow[];
        };
        if (isMounted) {
          setQuotations(result.requests ?? []);
        }
      } catch (err) {
        if (isMounted) {
          setQuotationsError(
            err instanceof Error
              ? err.message
              : "Failed to load quotation requests.",
          );
        }
      } finally {
        if (isMounted) {
          setQuotationsLoading(false);
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

  const recentActivity = useMemo(() => {
    const activities: Array<{ id: string; text: string; createdAt: string }> =
      [];

    messages.forEach((message) => {
      activities.push({
        id: `message-${message.id}`,
        text: `Message received from ${message.full_name}.`,
        createdAt: message.created_at,
      });
    });

    boqRequests.forEach((request) => {
      activities.push({
        id: `boq-${request.id}`,
        text: `BOQ request submitted by ${request.full_name}.`,
        createdAt: request.created_at,
      });
    });

    quotations.forEach((request) => {
      activities.push({
        id: `quotation-${request.id}`,
        text: `Quotation request submitted by ${request.full_name}.`,
        createdAt: request.created_at,
      });
    });

    return activities
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);
  }, [boqRequests, messages, quotations]);

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

  const deleteBoqRequest = async (request: BoqRow) => {
    if (!token) return;
    const response = await fetch(`/api/admin/boq/${request.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      setBoqError("Failed to delete BOQ request.");
      return;
    }
    setBoqRequests((current) =>
      current.filter((item) => item.id !== request.id),
    );
  };

  const toggleQuotationRead = async (request: QuotationRow) => {
    if (!token) return;
    const nextRead = !request.read_at;
    await fetch(`/api/admin/quotations/${request.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ read: nextRead }),
    });
    setQuotations((current) =>
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
      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
      };
      const errorMessage = data.message || "Failed to delete message.";
      setMessagesError(errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
    setMessages((current) => current.filter((item) => item.id !== message.id));
    setActiveMessage(null);
    toast.success("Message deleted.");
  };

  const deleteQuotation = async (request: QuotationRow) => {
    if (!token) return;
    const response = await fetch(`/api/admin/quotations/${request.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      setQuotationsError("Failed to delete quotation request.");
      return;
    }
    setQuotations((current) =>
      current.filter((item) => item.id !== request.id),
    );
    if (activeQuotation?.id === request.id) {
      setActiveQuotation(null);
    }
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
          <TabsTrigger value="quotations">QUOTATIONS</TabsTrigger>
          <TabsTrigger value="boq">BOQ</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[
              { label: "QUOTATIONS", value: String(quotations.length) },
              { label: "BOQ", value: String(boqRequests.length) },
              { label: "Messages", value: String(messages.length) },
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
              {recentActivity.length ? (
                recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between"
                  >
                    <span>{activity.text}</span>
                    <span>{new Date(activity.createdAt).toLocaleString()}</span>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-border/60 bg-muted/10 p-4">
                  No recent activity yet.
                </div>
              )}
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
                            <ConfirmationAlert
                              title="Delete message?"
                              description="This action cannot be undone."
                              confirmLabel="Delete"
                              onConfirm={() => deleteMessage(message)}
                            >
                              <Button
                                variant="outline"
                                className="rounded-full px-4"
                              >
                                Delete
                              </Button>
                            </ConfirmationAlert>
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
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              className="rounded-full px-4"
                              onClick={() => void toggleBoqRead(request)}
                            >
                              {request.read_at ? "Mark Unread" : "Mark Read"}
                            </Button>
                            <ConfirmationAlert
                              title="Delete BOQ request?"
                              description="This action cannot be undone."
                              confirmLabel="Delete"
                              onConfirm={() => deleteBoqRequest(request)}
                            >
                              <Button
                                variant="outline"
                                className="rounded-full px-4"
                              >
                                Delete
                              </Button>
                            </ConfirmationAlert>
                          </div>
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

        <TabsContent value="quotations">
          <PrimeCard className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Quotation Requests</h2>
              <span className="text-xs text-muted-foreground">
                {quotations.length} total
              </span>
            </div>

            <div className="mt-4">
              {quotationsError ? (
                <div className="rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {quotationsError}
                </div>
              ) : null}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotationsLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-sm">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : quotations.length ? (
                    quotations.map((request) => (
                      <TableRow
                        key={request.id}
                        className={
                          request.read_at ? "bg-emerald-500/5" : undefined
                        }
                      >
                        <TableCell className="font-medium">
                          {request.full_name}
                        </TableCell>
                        <TableCell>{request.email}</TableCell>
                        <TableCell>{request.company ?? "-"}</TableCell>
                        <TableCell>{request.total_items}</TableCell>
                        <TableCell>{request.total_quantity}</TableCell>
                        <TableCell>
                          {new Date(request.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {request.read_at ? "Read" : "New"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              className="rounded-full px-4"
                              onClick={() => setActiveQuotation(request)}
                            >
                              View
                            </Button>
                            <Button
                              variant="outline"
                              className="rounded-full px-4"
                              onClick={() => void toggleQuotationRead(request)}
                            >
                              {request.read_at ? "Mark Unread" : "Mark Read"}
                            </Button>
                            <ConfirmationAlert
                              title="Delete quotation request?"
                              description="This action cannot be undone."
                              confirmLabel="Delete"
                              onConfirm={() => deleteQuotation(request)}
                            >
                              <Button
                                variant="outline"
                                className="rounded-full px-4"
                              >
                                Delete
                              </Button>
                            </ConfirmationAlert>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-sm">
                        No quotation requests yet.
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

      <Dialog
        open={Boolean(activeQuotation)}
        onOpenChange={() => setActiveQuotation(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quotation request details</DialogTitle>
            <DialogDescription>
              {activeQuotation?.full_name} •{" "}
              {activeQuotation?.created_at
                ? new Date(activeQuotation.created_at).toLocaleString()
                : ""}
            </DialogDescription>
          </DialogHeader>
          {activeQuotation ? (
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Contact
                </p>
                <p>{activeQuotation.email}</p>
                {activeQuotation.phone ? <p>{activeQuotation.phone}</p> : null}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Company
                </p>
                <p>{activeQuotation.company ?? "-"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Consultation
                </p>
                <p>{activeQuotation.needs_consultation ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Project notes
                </p>
                <p>{activeQuotation.project_notes ?? "-"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Quote items
                </p>
                <div className="max-h-56 space-y-2 overflow-auto rounded-xl border border-border/60 p-3">
                  {activeQuotation.cart_items?.length ? (
                    activeQuotation.cart_items.map((item, index) => (
                      <div
                        key={`${item.id}-${index}`}
                        className="rounded-md border border-border/60 bg-muted/20 px-2 py-2"
                      >
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Code No. {item.partNumber} • Qty {item.quantity} •{" "}
                          {item.source}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      No cart items attached.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveQuotation(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
