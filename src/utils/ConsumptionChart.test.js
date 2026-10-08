// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ConsumptionChart from '../components/ConsumptionChart.vue'

// vi.hoisted körs före alla importer, så mocken och mockDestroy finns
// garanterat när vi.mock-fabriken och komponenten laddas.
const { mockDestroy, MockChart } = vi.hoisted(() => {
  const mockDestroy = vi.fn()
  const MockChart = vi.fn(function () {
    return { destroy: mockDestroy }
  })
  MockChart.register = vi.fn()
  return { mockDestroy, MockChart }
})

// Mocka chart.js (namngivna importer, se ConsumptionChart.vue)
vi.mock('chart.js', () => ({
  Chart: MockChart,
  BarController: {},
  BarElement: {},
  CategoryScale: {},
  LinearScale: {},
  Tooltip: {},
}))

const Chart = MockChart

describe('ConsumptionChart.vue', () => {
  beforeEach(() => {
    // Rensa tidigare anrop inför varje test
    vi.clearAllMocks()
  })

  it('renderar ett canvas-element', () => {
    const wrapper = mount(ConsumptionChart, {
      props: { months: ['Jan', 'Feb'], values: [10, 20] },
    })

    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('initierar Chart.js med rätt props på onMounted', () => {
    const months = ['Jan', 'Feb', 'Mar']
    const values = [100, 200, 150]

    mount(ConsumptionChart, {
      props: { months, values },
    })

    // Kontrollera att Chart-konstruktorn anropades exakt 1 gång
    expect(Chart).toHaveBeenCalledTimes(1)

    // Hämta de argument som skickades till new Chart(...)
    const chartArgs = vi.mocked(Chart).mock.calls[0]
    const chartConfig = chartArgs[1] // Det andra argumentet är konfigurationsobjektet

    // Verifiera att rätt konfiguration och data skickades in
    expect(chartConfig.type).toBe('bar')
    expect(chartConfig.data.labels).toEqual(months)
    expect(chartConfig.data.datasets[0].data).toEqual(values)
    expect(chartConfig.data.datasets[0].label).toBe('Förbrukning (kWh)')
  })

  it('anropar chart.destroy() när komponenten avmonteras (onBeforeUnmount)', () => {
    const wrapper = mount(ConsumptionChart, {
      props: { months: ['Jan'], values: [100] },
    })

    // Avmontera komponenten för att trigga onBeforeUnmount
    wrapper.unmount()

    // Verifiera att vår mockade destroy-funktion kördes
    expect(mockDestroy).toHaveBeenCalledTimes(1)
  })
})
