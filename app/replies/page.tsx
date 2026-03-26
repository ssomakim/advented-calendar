"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import RichText from "@/components/RichText";

type Reply = {
  id: string;
  name: string;
  message: string;
  isSecret: boolean;
  createdAt: string;
};

export default function RepliesPage() {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [editIsSecret, setEditIsSecret] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  async function loadReplies() {
    try {
      setLoading(true);

      const res = await fetch("/api/reply", {
        cache: "no-store",
      });

      const data = await res.json();

      setReplies(data.replies ?? []);
      setIsAdmin(Boolean(data.isAdmin));
    } catch {
      setReplies([]);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReplies();
  }, []);

  async function handleAdminLogin(e: FormEvent) {
    e.preventDefault();
    setAdminError("");

    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: adminPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAdminError(data.error ?? "관리자 로그인에 실패했습니다.");
        return;
      }

      setAdminPassword("");
      setShowAdminLogin(false);
      await loadReplies();
    } catch {
      setAdminError("네트워크 오류가 발생했습니다.");
    }
  }

  function startEdit(reply: Reply) {
    setEditingId(reply.id);
    setEditName(reply.name);
    setEditMessage(reply.message);
    setEditIsSecret(reply.isSecret);
    setActionError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditMessage("");
    setEditIsSecret(false);
    setActionError("");
  }

  async function handleUpdate(id: string) {
    setActionError("");

    if (!editName.trim()) {
      setActionError("보내는 이를 입력해 주세요.");
      return;
    }

    if (!editMessage.trim()) {
      setActionError("편지 내용을 입력해 주세요.");
      return;
    }

    try {
      setActionLoading(true);

      const res = await fetch(`/api/reply/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editName,
          message: editMessage,
          isSecret: editIsSecret,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setActionError(data.error ?? "답장을 수정하지 못했습니다.");
        return;
      }

      cancelEdit();
      await loadReplies();
    } catch {
      setActionError("네트워크 오류가 발생했습니다.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const ok = window.confirm("이 답장을 삭제할까요?");
    if (!ok) return;

    setActionError("");

    try {
      setActionLoading(true);

      const res = await fetch(`/api/reply/${id}`, {
        method: "DELETE",
      });

      let data: any = null;

      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        setActionError(data?.error ?? "답장을 삭제하지 못했습니다.");
        return;
      }

      if (editingId === id) {
        cancelEdit();
      }

      await loadReplies();
    } catch {
      setActionError("네트워크 오류가 발생했습니다.");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-[420px] px-6 py-16">
      <header className="text-center mb-10">
        <div className="flex items-center justify-center gap-6">
          <Link
            href="/"
            className="text-[10px] tracking-[0.18em] text-neutral-500 opacity-70 hover:opacity-100"
          >
            Home
          </Link>

          <Link
            href="/book?day=1"
            className="text-[10px] tracking-[0.18em] text-neutral-500 opacity-70 hover:opacity-100"
          >
            Calendar
          </Link>

          <Link
            href="/about"
            className="text-[10px] tracking-[0.18em] text-neutral-500 opacity-70 hover:opacity-100"
          >
            About
          </Link>
        </div>
      </header>

      <h1 className="mb-6 text-center text-sm font-semibold text-neutral-900">
        답장들
      </h1>

      {isAdmin && (
        <div className="mb-6 border border-neutral-200 p-3 text-[12px] text-neutral-600">
          관리자 모드입니다. 비밀 답장도 표시됩니다.
        </div>
      )}

      {showAdminLogin && !isAdmin && (
        <form onSubmit={handleAdminLogin} className="mb-8 space-y-3 border border-neutral-200 p-4">
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            placeholder="관리자 비밀번호"
            className="w-full border border-neutral-300 px-3 py-2 text-[12px] outline-none focus:border-neutral-500"
          />

          {adminError ? (
            <p className="text-[12px] text-red-500">{adminError}</p>
          ) : null}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setShowAdminLogin(false);
                setAdminError("");
                setAdminPassword("");
              }}
              className="border border-neutral-300 px-4 py-2 text-[12px] text-neutral-700 transition hover:bg-neutral-100"
            >
              닫기
            </button>

            <button
              type="submit"
              className="border border-neutral-300 px-4 py-2 text-[12px] text-neutral-900 transition hover:bg-neutral-100"
            >
              로그인
            </button>
          </div>
        </form>
      )}

      {actionError ? (
        <p className="mb-4 text-[12px] text-red-500">{actionError}</p>
      ) : null}

      {loading ? (
        <p className="text-[12px] text-neutral-500">불러오는 중...</p>
      ) : (
        <div className="space-y-4">
          {replies.length === 0 ? (
            <p className="text-[12px] text-neutral-500">
              아직 도착한 답장이 없어요.
            </p>
          ) : (
            replies.map((reply) => (
              <div key={reply.id} className="border border-neutral-200 px-4 py-4">
                {editingId === reply.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      maxLength={30}
                      className="w-full border border-neutral-300 px-3 py-2 text-[12px] outline-none focus:border-neutral-500"
                    />

                    <textarea
                      value={editMessage}
                      onChange={(e) => setEditMessage(e.target.value)}
                      maxLength={2000}
                      rows={7}
                      className="w-full border border-neutral-300 px-3 py-2 text-[12px] whitespace-pre-wrap outline-none focus:border-neutral-500"
                    />

                    <label className="flex items-center gap-2 text-[12px] text-neutral-700">
                      <input
                        type="checkbox"
                        checked={editIsSecret}
                        onChange={(e) => setEditIsSecret(e.target.checked)}
                        className="h-3.5 w-3.5"
                      />
                      몰래 보내기
                    </label>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="border border-neutral-300 px-3 py-1.5 text-[12px] text-neutral-700 hover:bg-neutral-100"
                      >
                        취소
                      </button>

                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleUpdate(reply.id)}
                        className="border border-neutral-300 px-3 py-1.5 text-[12px] text-neutral-900 hover:bg-neutral-100 disabled:opacity-50"
                      >
                        저장
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-2 text-[12px] text-neutral-700">
                      {reply.name}
                      {reply.isSecret && isAdmin ? " · 비밀 답장" : ""}
                    </div>

                    <RichText
                      text={reply.message}
                      className="text-[12px] leading-5 text-neutral-800"
                    />

                    {isAdmin && (
                      <div className="mt-4 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(reply)}
                          className="border border-neutral-300 px-3 py-1.5 text-[12px] text-neutral-700 hover:bg-neutral-100"
                        >
                          수정
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(reply.id)}
                          className="border border-neutral-300 px-3 py-1.5 text-[12px] text-neutral-700 hover:bg-neutral-100"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {!isAdmin && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setShowAdminLogin(true)}
            className="text-[10px] text-neutral-300 hover:text-neutral-500"
            aria-label="관리자 로그인 열기"
          >
            *
          </button>
        </div>
      )}
    </main>
  );
}