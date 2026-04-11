import { Application, ApplicationStatus } from '../types';

type Props = {
  applications: Application[];
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onSelect: (application: Application) => void;
};

const statuses: ApplicationStatus[] = ['Applied', 'Phone Screen', 'Interview', 'Offer', 'Rejected'];

const Board = ({ applications, onStatusChange, onSelect }: Props) => {
  const handleDrop = (event: React.DragEvent<HTMLDivElement>, status: ApplicationStatus) => {
    event.preventDefault();
    const id = event.dataTransfer.getData('applicationId');
    if (id) {
      onStatusChange(id, status);
    }
  };

  return (
    <div className="grid gap-4 xl:grid-cols-5">
      {statuses.map((status) => (
        <div
          key={status}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => handleDrop(event, status)}
          className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="mb-4 text-lg font-semibold text-slate-800">{status}</div>
          <div className="space-y-3 min-h-[120px]">
            {applications.filter((app) => app.status === status).map((app) => (
              <button
                key={app._id}
                type="button"
                draggable
                onDragStart={(event) => event.dataTransfer.setData('applicationId', app._id)}
                onClick={() => onSelect(app)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-left shadow-sm transition hover:border-slate-400"
              >
                <div className="text-sm font-semibold text-slate-900">{app.company}</div>
                <div className="text-sm text-slate-600">{app.role}</div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>{new Date(app.dateApplied).toLocaleDateString()}</span>
                  <span>{app.location || 'Remote/Unknown'}</span>
                </div>
              </button>
            ))}
            {applications.filter((app) => app.status === status).length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                Drop here or add a card
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Board;
