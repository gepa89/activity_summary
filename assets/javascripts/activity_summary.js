document.addEventListener('DOMContentLoaded', function () {
  const filterButton = document.getElementById('filter-button');
  const exportButton = document.getElementById('export-excel');
  const prevMonthBtn = document.getElementById('prev-month');
  const nextMonthBtn = document.getElementById('next-month');
  const startDateInput = document.getElementById('start_date');
  const endDateInput = document.getElementById('end_date');

  // Formatear la fecha en yyyy-MM-dd
  const formatDateForInput = (date) => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Obtener el primer y último día del mes
  const getMonthRange = (date) => {
    const firstDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
    const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0));
    return { firstDay, lastDay };
  };

  // Obtener parámetros del filtro
  const getFilterParams = () => ({
    project_id: document.getElementById('project_id').value,
    issue_id: document.getElementById('issue_id').value,
    user_id: document.getElementById('user_id').value,
    start_date: startDateInput.value,
    end_date: endDateInput.value
  });

  // Filtrar los datos
  const filterData = () => {
    const params = getFilterParams();

    fetch('/activity_summary/filter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
      },
      body: JSON.stringify(params)
    })
      .then(response => response.text())
      .then(html => {
        document.getElementById('planilla-container').innerHTML = html;
      })
      .catch(error => console.error('Error:', error));
  };

  // Cambiar de mes
  const changeMonth = (direction) => {
    let currentDate = startDateInput.value 
      ? new Date(startDateInput.value + 'T00:00:00Z') 
      : new Date();

    // Fijar al primer día del mes actual para evitar errores
    currentDate.setUTCDate(1);
    currentDate.setUTCMonth(currentDate.getUTCMonth() + direction);

    const { firstDay, lastDay } = getMonthRange(currentDate);
    startDateInput.value = formatDateForInput(firstDay);
    endDateInput.value = formatDateForInput(lastDay);
  };

  // Eventos de botones
  if (filterButton) filterButton.addEventListener('click', filterData);
  if (prevMonthBtn) prevMonthBtn.addEventListener('click', () => changeMonth(-1));
  if (nextMonthBtn) nextMonthBtn.addEventListener('click', () => changeMonth(1));

  // Inicialización de fechas si están vacías
  if (!startDateInput.value || !endDateInput.value) {
    const today = new Date();
    const { firstDay, lastDay } = getMonthRange(today);
    startDateInput.value = formatDateForInput(firstDay);
    endDateInput.value = formatDateForInput(lastDay);
  }
});
