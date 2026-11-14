import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit2, Check, X, AlertCircle } from 'lucide-react';
import { portfolioApi } from '../../api/portfolio';
import { Skill } from '../../types';

interface SkillManagerProps {
  skillsGrouped: Record<string, Skill[]>;
}

export const SkillManager: React.FC<SkillManagerProps> = ({ skillsGrouped }) => {
  const queryClient = useQueryClient();
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'Frontend',
    proficiency: 80,
    iconUrl: '',
    sortOrder: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Skill>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allSkills = Object.values(skillsGrouped).flat();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await portfolioApi.createSkill(newSkill);
      await queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      setNewSkill({
        name: '',
        category: newSkill.category,
        proficiency: 80,
        iconUrl: '',
        sortOrder: 0,
      });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to add skill.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (skill: Skill) => {
    setEditingId(skill._id);
    setEditData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      iconUrl: skill.iconUrl || '',
      sortOrder: skill.sortOrder || 0,
    });
  };

  const handleSaveEdit = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await portfolioApi.updateSkill(id, editData);
      await queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      setEditingId(null);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to update skill.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    setLoading(true);
    setError(null);
    try {
      await portfolioApi.deleteSkill(id);
      await queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to delete skill.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Add Skill Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-blue-400" />
          Add New Skill
        </h3>

        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <div className="sm:col-span-2">
            <input
              type="text"
              required
              placeholder="Skill Name (e.g. React, NestJS, Docker)"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <input
              type="text"
              required
              placeholder="Category (e.g. Frontend)"
              value={newSkill.category}
              onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <input
              type="number"
              min="1"
              max="100"
              placeholder="Proficiency (1-100)"
              value={newSkill.proficiency}
              onChange={(e) => setNewSkill({ ...newSkill, proficiency: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-full py-2 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-lg text-sm transition flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </form>
      </div>

      {/* Skills Table / List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Skills Matrix ({allSkills.length})</h3>
        </div>

        {allSkills.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No skills added yet. Use the form above to add your first skill.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Proficiency</th>
                  <th className="px-6 py-3">Order</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {allSkills.map((skill) => {
                  const isEditing = editingId === skill._id;

                  return (
                    <tr key={skill._id} className="hover:bg-slate-800/40 transition">
                      <td className="px-6 py-3.5 font-medium text-white">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.name || ''}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            className="px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-white"
                          />
                        ) : (
                          skill.name
                        )}
                      </td>

                      <td className="px-6 py-3.5">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.category || ''}
                            onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                            className="px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-white"
                          />
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-xs text-slate-300">
                            {skill.category}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-3.5">
                        {isEditing ? (
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={editData.proficiency || 80}
                            onChange={(e) =>
                              setEditData({ ...editData, proficiency: Number(e.target.value) })
                            }
                            className="w-16 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-white font-mono"
                          />
                        ) : (
                          <span className="font-mono text-xs text-slate-400">{skill.proficiency}%</span>
                        )}
                      </td>

                      <td className="px-6 py-3.5">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editData.sortOrder || 0}
                            onChange={(e) =>
                              setEditData({ ...editData, sortOrder: Number(e.target.value) })
                            }
                            className="w-14 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-white font-mono"
                          />
                        ) : (
                          <span className="font-mono text-xs text-slate-500">{skill.sortOrder}</span>
                        )}
                      </td>

                      <td className="px-6 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleSaveEdit(skill._id)}
                                className="p-1 hover:bg-emerald-500/20 text-emerald-400 rounded transition"
                                title="Save"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="p-1 hover:bg-slate-700 text-slate-400 rounded transition"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleStartEdit(skill)}
                                className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(skill._id)}
                                className="p-1 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded transition"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
