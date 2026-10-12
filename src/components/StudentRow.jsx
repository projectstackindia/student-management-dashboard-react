function StudentRow({ student, onEdit, onDelete }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {student.fullName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {student.rollNumber}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {student.department}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {student.year}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {student.email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(student)}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(student)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

export default StudentRow;
