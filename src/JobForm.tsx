import { useState } from 'react';

type ApplicationStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected';

interface JobFormData {
    company: string;
    position: string;
    status: ApplicationStatus;
    url: string;
    notes: string;
}

interface JobFormProps {
    onJobCreated: () => void;
}

const defaultForm: JobFormData = {
    company: '',
    position: '',
    status: 'Applied',
    url: '',
    notes: '',
};

export function JobForm({ onJobCreated }: JobFormProps) {
    const [form, setForm] = useState<JobFormData>(defaultForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    company: form.company,
                    position: form.position,
                    status: form.status,
                    url: form.url || null,
                    notes: form.notes || null,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create job application.');
            }

            setForm(defaultForm);
            onJobCreated();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="job-form" onSubmit={handleSubmit}>
            <div className="job-form-row">
                <div className="job-form-field">
                    <label htmlFor="company">Company</label>
                    <input
                        id="company"
                        name="company"
                        type="text"
                        placeholder="e.g. Stripe"
                        value={form.company}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="job-form-field">
                    <label htmlFor="position">Position</label>
                    <input
                        id="position"
                        name="position"
                        type="text"
                        placeholder="e.g. Backend Engineer"
                        value={form.position}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="job-form-field job-form-field--short">
                    <label htmlFor="status">Status</label>
                    <select id="status" name="status" value={form.status} onChange={handleChange}>
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>
            <div className="job-form-row">
                <div className="job-form-field">
                    <label htmlFor="url">URL <span className="job-form-optional">(optional)</span></label>
                    <input
                        id="url"
                        name="url"
                        type="url"
                        placeholder="https://jobs.company.com/..."
                        value={form.url}
                        onChange={handleChange}
                    />
                </div>
                <div className="job-form-field">
                    <label htmlFor="notes">Notes <span className="job-form-optional">(optional)</span></label>
                    <input
                        id="notes"
                        name="notes"
                        type="text"
                        placeholder="Recruiter contact, referral..."
                        value={form.notes}
                        onChange={handleChange}
                    />
                </div>
            </div>
            {error && <p className="state-message state-message--error">{error}</p>}
            <div className="job-form-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Application'}
                </button>
            </div>
        </form>
    );
}
