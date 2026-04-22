import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import api from '../services/api';

const SUBJECT_COLORS = { ADC: '#7B61FF', MA: '#00E5A0', ML: '#F59E0B', OOP: '#FF4D6A', ISPM: '#3B82F6', ICSR: '#EC4899' };
const OPTION_LABELS = ['A', 'B', 'C', 'D'];
const DIFFICULTIES = ['all', 'easy', 'medium', 'hard'];
const DIFF_COLORS = { easy: '#00E5A0', medium: '#F59E0B', hard: '#FF4D6A' };

// ── FlashCard ──────────────────────────────────────────────────────────────
function FlashCard({ card, index, total, onPrev, onNext }) {
  const [flipped, setFlipped] = useState(false);
  useEffect(() => setFlipped(false), [index]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '480px', marginBottom: '16px' }}>
        <span style={{ fontSize: '13px', color: '#6B7280' }}>Card {index + 1} of {total}</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {Array.from({ length: Math.min(total, 15) }).map((_, i) => (
            <div key={i} style={{ height: '4px', width: i === index ? '20px' : '6px', borderRadius: '999px', background: i === index ? '#7B61FF' : '#E5E4F0', transition: 'all 0.15s' }} />
          ))}
        </div>
      </div>

      {/* Card with 3D flip */}
      <div
        onClick={() => setFlipped(!flipped)}
        style={{ width: '480px', height: '280px', cursor: 'pointer', perspective: '1200px' }}
      >
        <div style={{
          width: '100%', height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.5s ease',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}>
          {/* Front — Question */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: '#FFFFFF',
            border: '1px solid #E5E4F0',
            borderRadius: '16px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '32px', textAlign: 'center', overflow: 'hidden',
          }}>
            <span style={{ position: 'absolute', fontSize: '140px', color: '#F3F2FF', fontWeight: '700', lineHeight: 1, userSelect: 'none', zIndex: 0 }}>?</span>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px', zIndex: 1 }}>Question</span>
            <p style={{ fontSize: '18px', color: '#1A1A2E', lineHeight: '1.6', fontFamily: 'Lora, serif', zIndex: 1, position: 'relative' }}>{card.question}</p>
            <p style={{ fontSize: '11px', color: '#C4C2E0', marginTop: '20px', zIndex: 1 }}>Click to reveal answer</p>
          </div>

          {/* Back — Answer */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: '#F3F2FF',
            border: '2px solid #7B61FF',
            borderRadius: '16px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '32px', textAlign: 'center',
          }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#7B61FF', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>Answer</span>
            <p style={{ fontSize: '16px', color: '#1A1A2E', lineHeight: '1.7', fontFamily: 'Lora, serif' }}>{card.answer}</p>
            <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '20px' }}>Click to flip back</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '20px' }}>
        <button onClick={onPrev} disabled={index === 0}
          style={{ background: 'none', border: 'none', cursor: index === 0 ? 'default' : 'pointer', fontSize: '14px', color: index === 0 ? '#E5E4F0' : '#6B7280', transition: 'color 0.15s', fontFamily: 'DM Sans, sans-serif' }}>
          ← Prev
        </button>
        <span style={{ fontSize: '13px', color: '#9CA3AF' }}>{index + 1} / {total}</span>
        <button onClick={onNext} disabled={index === total - 1}
          style={{ background: 'none', border: 'none', cursor: index === total - 1 ? 'default' : 'pointer', fontSize: '14px', color: index === total - 1 ? '#E5E4F0' : '#6B7280', transition: 'color 0.15s', fontFamily: 'DM Sans, sans-serif' }}>
          Next →
        </button>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
        {Array.from({ length: Math.min(total, 15) }).map((_, i) => (
          <div key={i} style={{ width: '6px', height: '6px', borderRadius: '999px', background: i === index ? '#7B61FF' : '#E5E4F0', transition: 'background 0.15s' }} />
        ))}
      </div>
    </div>
  );
}

// ── QuizCard ───────────────────────────────────────────────────────────────
function QuizCard({ card, index, total, onPrev, onNext, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => { setSelected(null); setRevealed(false); }, [index]);

  let mcq = null;
  try { mcq = JSON.parse(card.answer); } catch { mcq = null; }
  const valid = mcq && mcq.type === 'mcq' && mcq.options && mcq.correct;

  const handleSelect = (label) => {
    if (revealed) return;
    setSelected(label); setRevealed(true);
    if (onAnswer) onAnswer(label === mcq.correct);
  };

  if (!valid) return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E5E4F0', borderRadius: '12px', padding: '32px', textAlign: 'center', color: '#6B7280' }}>
      Re-upload this lecture to get MCQ questions.
    </div>
  );

  const optionBorder = (label) => {
    if (!revealed) return '#E5E4F0';
    if (label === mcq.correct) return '#00E5A0';
    if (label === selected) return '#FF4D6A';
    return '#E5E4F0';
  };
  const optionColor = (label) => {
    if (!revealed) return '#6B7280';
    if (label === mcq.correct) return '#00E5A0';
    if (label === selected) return '#FF4D6A';
    return '#9CA3AF';
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <span style={{ fontSize: '11px', fontWeight: '600', color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Question {index + 1} of {total}</span>
        {mcq?.difficulty && (
          <span style={{ fontSize: '11px', fontWeight: '600', color: DIFF_COLORS[mcq.difficulty] || '#6B7280', background: (DIFF_COLORS[mcq.difficulty] || '#6B7280') + '15', padding: '3px 10px', borderRadius: '999px', textTransform: 'capitalize' }}>
            {mcq.difficulty}
          </span>
        )}
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid #E5E4F0', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
        <p style={{ fontSize: '16px', fontWeight: '500', color: '#1A1A2E', lineHeight: '1.6' }}>{card.question}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
        {OPTION_LABELS.map(label => (
          <button key={label} onClick={() => handleSelect(label)}
            style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', borderRadius: '8px', border: `1px solid ${optionBorder(label)}`, background: '#F3F2FF', cursor: revealed ? 'default' : 'pointer', transition: 'all 0.15s', fontFamily: 'DM Sans, sans-serif' }}>
            <span style={{ width: '28px', height: '28px', borderRadius: '6px', background: revealed && label === mcq.correct ? '#00E5A0' : revealed && label === selected ? '#FF4D6A' : '#E5E4F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: revealed && (label === mcq.correct || label === selected) ? '#fff' : '#6B7280', flexShrink: 0 }}>
              {label}
            </span>
            <span style={{ fontSize: '14px', color: optionColor(label) }}>{mcq.options[label]}</span>
            {revealed && label === mcq.correct && <span style={{ marginLeft: 'auto', color: '#00E5A0', fontWeight: '700' }}>✓</span>}
            {revealed && label === selected && label !== mcq.correct && <span style={{ marginLeft: 'auto', color: '#FF4D6A', fontWeight: '700' }}>✗</span>}
          </button>
        ))}
      </div>

      {revealed && mcq.explanation && (
        <div style={{ background: 'rgba(123,97,255,0.06)', border: '1px solid rgba(123,97,255,0.15)', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
          <p style={{ fontSize: '11px', fontWeight: '600', color: '#7B61FF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Explanation</p>
          <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.6', fontFamily: 'Lora, serif' }}>{mcq.explanation}</p>
        </div>
      )}

      {!revealed && <p style={{ textAlign: 'center', fontSize: '12px', color: '#9CA3AF', marginBottom: '16px' }}>Select an option to reveal the answer</p>}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onPrev} disabled={index === 0}
          style={{ background: 'none', border: '1px solid #E5E4F0', borderRadius: '8px', padding: '8px 20px', fontSize: '13px', color: index === 0 ? '#E5E4F0' : '#6B7280', cursor: index === 0 ? 'default' : 'pointer', transition: 'all 0.15s', fontFamily: 'DM Sans, sans-serif' }}>
          ← Prev
        </button>
        <button onClick={onNext} disabled={index === total - 1}
          style={{ background: '#7B61FF', border: 'none', borderRadius: '8px', padding: '8px 20px', fontSize: '13px', color: '#fff', cursor: index === total - 1 ? 'default' : 'pointer', opacity: index === total - 1 ? 0.4 : 1, transition: 'all 0.15s', fontFamily: 'DM Sans, sans-serif' }}>
          Next →
        </button>
      </div>
    </div>
  );
}

// ── MCQ Section ────────────────────────────────────────────────────────────
function MCQSection({ mcqs }) {
  const [filter, setFilter] = useState('all');
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [finished, setFinished] = useState(false);

  const filtered = filter === 'all' ? mcqs : mcqs.filter(c => { try { return JSON.parse(c.answer)?.difficulty === filter; } catch { return false; } });
  const diffCount = (d) => mcqs.filter(c => { try { return JSON.parse(c.answer)?.difficulty === d; } catch { return false; } }).length;

  useEffect(() => { setIndex(0); setScore(0); setAnswered(0); setFinished(false); }, [filter]);

  const handleAnswer = (correct) => {
    if (correct) setScore(s => s + 1);
    setAnswered(a => a + 1);
    if (index === filtered.length - 1) setFinished(true);
  };

  if (mcqs.length === 0) return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E5E4F0', borderRadius: '12px', padding: '32px', textAlign: 'center', color: '#6B7280' }}>
      No MCQ questions yet. Re-upload to generate.
    </div>
  );

  return (
    <div>
      {/* Score + filter row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {DIFFICULTIES.map(d => {
          const count = d === 'all' ? mcqs.length : diffCount(d);
          const isActive = filter === d;
          const color = d === 'all' ? '#7B61FF' : DIFF_COLORS[d] || '#6B7280';
          return (
            <button key={d} onClick={() => setFilter(d)}
              style={{ padding: '6px 16px', borderRadius: '999px', border: `1px solid ${isActive ? color : '#E5E4F0'}`, background: isActive ? color + '20' : 'transparent', color: isActive ? color : '#6B7280', fontSize: '13px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.15s', textTransform: 'capitalize', fontFamily: 'DM Sans, sans-serif' }}>
              {d === 'all' ? 'All' : d} ({count})
            </button>
          );
        })}
        {answered > 0 && (
          <div style={{ marginLeft: 'auto', background: '#7B61FF', color: '#fff', padding: '6px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: '600' }}>
            Score: {score}/{answered} ({Math.round((score/answered)*100)}%)
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E4F0', borderRadius: '12px', padding: '32px', textAlign: 'center', color: '#6B7280' }}>
          No {filter} questions available.
        </div>
      ) : finished ? (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E4F0', borderRadius: '12px', padding: '48px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>{score/filtered.length >= 0.8 ? '🏆' : score/filtered.length >= 0.5 ? '👍' : '📚'}</div>
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1A1A2E', marginBottom: '8px' }}>Quiz Complete!</h3>
          <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '24px' }}>
            You scored <span style={{ color: '#7B61FF', fontWeight: '600' }}>{score} out of {filtered.length}</span> ({Math.round((score/filtered.length)*100)}%)
          </p>
          <div style={{ width: '200px', height: '4px', background: '#E5E4F0', borderRadius: '999px', margin: '0 auto 24px' }}>
            <div style={{ width: `${(score/filtered.length)*100}%`, height: '100%', background: '#7B61FF', borderRadius: '999px' }} />
          </div>
          <button onClick={() => { setIndex(0); setScore(0); setAnswered(0); setFinished(false); }}
            style={{ background: '#7B61FF', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
            Retry Quiz
          </button>
        </div>
      ) : (
        <QuizCard card={filtered[index]} index={index} total={filtered.length}
          onPrev={() => setIndex(i => Math.max(0, i - 1))}
          onNext={() => setIndex(i => Math.min(filtered.length - 1, i + 1))}
          onAnswer={handleAnswer}
        />
      )}
    </div>
  );
}

// ── LectureChat ────────────────────────────────────────────────────────────
function LectureChat({ lectureId }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I've read this lecture. Ask me anything about it — I'll only answer based on what was actually taught." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput(''); setLoading(true);
    try {
      const { data } = await api.post(`/chat/${lectureId}`, { message: userMsg.content, history: messages.slice(-6) });
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E5E4F0', borderRadius: '12px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 220px)', minHeight: '400px', maxHeight: '700px' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E4F0' }}>
        <p style={{ fontSize: '15px', fontWeight: '600', color: '#1A1A2E', marginBottom: '2px' }}>Lecture Tutor</p>
        <p style={{ fontSize: '12px', color: '#9CA3AF' }}>Answers based only on this lecture</p>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '85%', padding: '10px 14px', fontSize: '14px', lineHeight: '1.6',
              fontFamily: 'Lora, serif',
              background: m.role === 'user' ? '#7B61FF' : '#F3F2FF',
              color: m.role === 'user' ? '#fff' : '#1A1A2E',
              border: m.role === 'user' ? 'none' : '1px solid #E5E4F0',
              borderRadius: m.role === 'user' ? '12px 0 12px 12px' : '0 12px 12px 12px',
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ background: '#F3F2FF', border: '1px solid #E5E4F0', borderRadius: '0 12px 12px 12px', padding: '12px 16px', display: 'flex', gap: '4px', alignItems: 'center' }}>
              {[0,1,2].map(i => <div key={i} className="skeleton" style={{ width: '6px', height: '6px', borderRadius: '999px', animationDelay: `${i*0.15}s` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '12px', borderTop: '1px solid #E5E4F0' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            style={{ flex: 1, background: '#F8F7FF', border: '1px solid #E5E4F0', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#1A1A2E', outline: 'none', fontFamily: 'DM Sans, sans-serif', transition: 'border-color 0.15s' }}
            placeholder="Ask about this lecture..."
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            onFocus={e => e.target.style.borderColor = '#7B61FF'}
            onBlur={e => e.target.style.borderColor = '#E5E4F0'}
          />
          <button onClick={send} disabled={loading || !input.trim()}
            style={{ width: '36px', height: '36px', background: '#7B61FF', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: loading || !input.trim() ? 0.4 : 1, transition: 'opacity 0.15s', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M13 1L1 7l5 2 2 5 5-13z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/></svg>
          </button>
        </div>
        <p style={{ textAlign: 'center', fontSize: '11px', color: '#9CA3AF', marginTop: '8px' }}>Powered by Groq LLaMA · context-aware</p>
      </div>
    </div>
  );
}

// ── Mobile Chat Button + Drawer ────────────────────────────────────────────
function MobileChatButton({ lectureId }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Floating button — only visible on mobile */}
      <button onClick={() => setOpen(true)}
        style={{ position: 'fixed', bottom: '24px', right: '24px', width: '52px', height: '52px', borderRadius: '999px', background: '#7B61FF', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 40, boxShadow: '0 4px 20px rgba(123,97,255,0.4)' }}
        className="mobile-chat-fab">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M11 2C6.03 2 2 5.8 2 10.5c0 2.1.8 4 2.1 5.5L3 20l4.3-1.4C8.5 19.2 9.7 19.5 11 19.5c4.97 0 9-3.8 9-8.5S15.97 2 11 2z" fill="white"/>
        </svg>
      </button>

      {/* Drawer */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60 }} className="mobile-chat-fab">
          {/* Backdrop */}
          <div onClick={() => setOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
          {/* Drawer */}
          <div className="chat-drawer" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '85vh', background: '#FFFFFF', borderRadius: '16px 16px 0 0', border: '1px solid #E5E4F0', display: 'flex', flexDirection: 'column' }}>
            {/* Drag handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
              <div style={{ width: '40px', height: '4px', background: '#E5E4F0', borderRadius: '999px' }} />
            </div>
            {/* Close */}
            <button onClick={() => setOpen(false)}
              style={{ position: 'absolute', top: '12px', right: '16px', background: 'none', border: 'none', color: '#6B7280', fontSize: '20px', cursor: 'pointer', lineHeight: 1, minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ×
            </button>
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <LectureChat lectureId={lectureId} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function LecturePage() {
  const { id } = useParams();
  const [lecture, setLecture] = useState(null);
  const [tab, setTab] = useState('notes');
  const [fcIndex, setFcIndex] = useState(0);
  const [glossary, setGlossary] = useState([]);
  const [glossaryLoaded, setGlossaryLoaded] = useState(false);

  const fetchLecture = useCallback(() => {
    api.get(`/lectures/${id}`).then(({ data }) => setLecture(data)).catch(console.error);
  }, [id]);

  useEffect(() => {
    fetchLecture();
    const interval = setInterval(() => {
      setLecture(prev => {
        if (prev?.status === 'ready' || prev?.status === 'failed') { clearInterval(interval); return prev; }
        fetchLecture(); return prev;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [fetchLecture]);

  const downloadNotes = () => {
    if (!lecture?.notes) return;
    const blob = new Blob([lecture.notes.content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${lecture.title}-notes.txt`;
    a.click();
  };

  if (!lecture) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
      <div style={{ textAlign: 'center', color: '#9CA3AF' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎓</div>
        <p>Loading lecture...</p>
      </div>
    </div>
  );

  const allCards = lecture.flashcards || [];
  const flashcards = allCards.filter(c => { try { return JSON.parse(c.answer)?.type !== 'mcq'; } catch { return true; } });
  const mcqs = allCards.filter(c => { try { return JSON.parse(c.answer)?.type === 'mcq'; } catch { return false; } });
  const abbr = lecture.subject?.split(' ')[0];
  const subjectColor = SUBJECT_COLORS[abbr] || '#7B61FF';

  const tabs = [
    { key: 'notes', label: '📝 Notes' },
    { key: 'flashcards', label: '🃏 Flashcards', count: flashcards.length },
    { key: 'mcq', label: '🧠 MCQ Quiz', count: mcqs.length },
    { key: 'glossary', label: '📖 Glossary', count: glossary.length || undefined },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      <Link to="/library" style={{ fontSize: '13px', color: '#7B61FF', textDecoration: 'none', display: 'inline-block', marginBottom: '24px' }}>← Back to Library</Link>

      {/* Header */}
      <div className="lecture-header" style={{ background: '#FFFFFF', border: '1px solid #E5E4F0', borderRadius: '12px', padding: '24px 32px', marginBottom: '24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1A1A2E', marginBottom: '12px', lineHeight: '1.3' }}>{lecture.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', background: subjectColor + '20', color: subjectColor, padding: '4px 10px', borderRadius: '999px' }}>{abbr}</span>
            <span style={{ fontSize: '12px', fontWeight: '500', color: lecture.status === 'ready' ? '#00E5A0' : lecture.status === 'failed' ? '#FF4D6A' : '#F59E0B' }}>
              ● {lecture.status === 'ready' ? 'Ready' : lecture.status === 'failed' ? 'Failed' : 'Processing'}
            </span>
          </div>
        </div>
        <p className="lecture-header-timestamp" style={{ fontSize: '12px', color: '#9CA3AF', flexShrink: 0, marginTop: '4px' }}>
          Last opened · {new Date(lecture.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      </div>

      {/* Processing */}
      {lecture.status !== 'ready' && lecture.status !== 'failed' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E4F0', borderRadius: '12px', padding: '48px', textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚙️</div>
          <p style={{ fontSize: '16px', fontWeight: '600', color: '#1A1A2E', marginBottom: '6px' }}>Processing your lecture...</p>
          <p style={{ fontSize: '13px', color: '#6B7280' }}>Transcribing and generating content. Takes 1–3 minutes.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '16px' }}>
            {[0,1,2].map(i => <div key={i} className="skeleton" style={{ width: '8px', height: '8px', borderRadius: '999px', animationDelay: `${i*0.15}s` }} />)}
          </div>
        </div>
      )}

      {lecture.status === 'failed' && (
        <div style={{ background: 'rgba(255,77,106,0.06)', border: '1px solid rgba(255,77,106,0.15)', borderRadius: '12px', padding: '32px', textAlign: 'center', marginBottom: '24px' }}>
          <p style={{ fontSize: '16px', fontWeight: '600', color: '#FF4D6A' }}>Processing failed</p>
          <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>Please try uploading again.</p>
        </div>
      )}

      {lecture.status === 'ready' && (
        <div>
          {/* Tabs */}
          <div className="tab-bar" style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {tabs.map(t => {
              const active = tab === t.key;
              return (
                <button key={t.key} onClick={() => {
                  setTab(t.key);
                  if (t.key === 'glossary' && !glossaryLoaded) {
                    api.get(`/glossary/${id}`).then(({ data }) => { setGlossary(data.glossary || []); setGlossaryLoaded(true); }).catch(console.error);
                  }
                }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 20px', borderRadius: '999px', border: `1px solid ${active ? '#7B61FF' : '#E5E4F0'}`, background: active ? 'rgba(123,97,255,0.10)' : 'transparent', color: active ? '#1A1A2E' : '#6B7280', fontSize: '13px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'DM Sans, sans-serif' }}>
                  {t.label}
                  {t.count !== undefined && t.count > 0 && (
                    <span style={{ fontSize: '11px', background: '#E5E4F0', color: '#6B7280', padding: '1px 7px', borderRadius: '999px' }}>{t.count}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Notes */}
          {tab === 'notes' && (
            <div className="notes-chat-grid" style={{ display: 'grid', gridTemplateColumns: '65% 35%', gap: '24px', alignItems: 'start' }}>
              <div style={{ background: '#FFFFFF', border: '1px solid #E5E4F0', borderRadius: '12px', padding: '32px' }}>
                <p style={{ fontSize: '11px', fontWeight: '600', color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '24px' }}>Lecture Notes</p>
                {!lecture.notes ? <p style={{ color: '#9CA3AF', textAlign: 'center', padding: '32px' }}>No notes available.</p> : (
                  <>
                    <div style={{ fontFamily: 'Lora, serif' }} className="notes-content">
                      <style>{`
                        .notes-content h2 { font-size: 18px; font-weight: 700; color: #1A1A2E; margin: 32px 0 12px; padding-left: 12px; border-left: 3px solid #7B61FF; background: #F3F2FF; padding-top: 4px; padding-bottom: 4px; border-radius: 0 6px 6px 0; }
                        .notes-content h3 { font-size: 15px; font-weight: 600; color: #7B61FF; margin: 20px 0 8px; font-family: 'DM Sans', sans-serif; }
                        .notes-content p { font-size: 15px; color: #4B5563; line-height: 1.8; margin-bottom: 12px; }
                        .notes-content ul { list-style: none; padding-left: 0; margin-bottom: 12px; }
                        .notes-content li { font-size: 15px; color: #4B5563; line-height: 1.8; padding-left: 20px; position: relative; margin-bottom: 6px; }
                        .notes-content li::before { content: ''; position: absolute; left: 0; top: 11px; width: 5px; height: 5px; border-radius: 999px; background: #7B61FF; }
                        .notes-content ol { padding-left: 20px; margin-bottom: 12px; }
                        .notes-content ol li { font-size: 15px; color: #4B5563; line-height: 1.8; padding-left: 8px; }
                        .notes-content ol li::before { display: none; }
                        .notes-content strong { color: #1A1A2E; font-weight: 600; font-family: 'DM Sans', sans-serif; }
                      `}</style>
                      <ReactMarkdown>{lecture.notes.content}</ReactMarkdown>
                    </div>
                    <button onClick={downloadNotes}
                      style={{ marginTop: '24px', background: '#7B61FF', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'opacity 0.15s' }}>
                      ⬇️ Download as .txt
                    </button>
                  </>
                )}
              </div>
              <div className="chat-sticky chat-panel-desktop" style={{ position: 'sticky', top: '80px' }}>
                <LectureChat lectureId={id} />
              </div>
            </div>
          )}

          {/* Mobile floating chat button */}
          <MobileChatButton lectureId={id} />

          {/* Flashcards */}
          {tab === 'flashcards' && (
            <div style={{ background: '#FFFFFF', border: '1px solid #E5E4F0', borderRadius: '12px', padding: '40px' }}>
              {flashcards.length === 0
                ? <p style={{ textAlign: 'center', color: '#9CA3AF', padding: '32px' }}>No flashcards. Re-upload to generate.</p>
                : <FlashCard card={flashcards[fcIndex]} index={fcIndex} total={flashcards.length}
                    onPrev={() => setFcIndex(i => Math.max(0, i - 1))}
                    onNext={() => setFcIndex(i => Math.min(flashcards.length - 1, i + 1))}
                  />
              }
            </div>
          )}

          {/* MCQ */}
          {tab === 'mcq' && (
            <div style={{ background: '#FFFFFF', border: '1px solid #E5E4F0', borderRadius: '12px', padding: '24px' }}>
              <MCQSection mcqs={mcqs} />
            </div>
          )}

          {/* Glossary */}
          {tab === 'glossary' && (
            <div style={{ background: '#FFFFFF', border: '1px solid #E5E4F0', borderRadius: '12px', padding: '24px' }}>
              <p style={{ fontSize: '11px', fontWeight: '600', color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '20px' }}>Key Terms & Glossary</p>
              {!glossaryLoaded ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} style={{ background: '#F3F2FF', border: '1px solid #E5E4F0', borderRadius: '12px', padding: '20px' }}>
                      <div className="skeleton" style={{ height: '14px', width: '40%', marginBottom: '10px' }} />
                      <div className="skeleton" style={{ height: '12px', width: '90%', marginBottom: '6px' }} />
                      <div className="skeleton" style={{ height: '12px', width: '70%' }} />
                    </div>
                  ))}
                </div>
              ) : glossary.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#9CA3AF', padding: '32px' }}>No glossary available. Re-upload to generate.</p>
              ) : (
                <div className="glossary-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  {glossary.map((item, i) => (
                    <div key={i} style={{ background: '#F3F2FF', border: '1px solid #E5E4F0', borderRadius: '12px', padding: '20px', transition: 'border-color 0.15s', cursor: 'default' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#7B61FF'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E4F0'}>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#7B61FF', marginBottom: '8px', fontFamily: 'DM Sans, sans-serif' }}>{item.term}</p>
                      <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.6', fontFamily: 'Lora, serif' }}>{item.definition}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
