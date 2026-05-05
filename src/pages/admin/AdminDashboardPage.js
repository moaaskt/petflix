/**
 * AdminDashboardPage - Dashboard Administrativo com Gráficos
 */
import ApexCharts from 'apexcharts';
import { getDashboardStats } from '../../services/api/dashboard.service.js';

// Cores do Petflix
const PETFLIX_RED = '#E50914';
const PETFLIX_DARK = '#1a1a1a';

// Variável global para armazenar as estatísticas
let dashboardStats = null;

export async function render() {
  return `
    <div class="p-8 max-w-7xl mx-auto space-y-10 animate-fade-in">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <h1 class="text-4xl font-black text-white tracking-tight">Admin <span class="text-red-600">Dashboard</span></h1>
          <p class="text-zinc-500 mt-2 font-medium">Relatórios e insights da plataforma Petflix.</p>
        </div>
        <button 
          id="btn-seed"
          class="flex items-center gap-3 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(229,9,20,0.3)] hover:shadow-[0_0_30px_rgba(229,9,20,0.5)] active:scale-95 text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clip-rule="evenodd" />
          </svg>
          Sincronizar Dados
        </button>
      </div>
      
      <!-- KPIs Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Usuários -->
        <div class="glass-panel group p-6 rounded-2xl border border-white/5 hover:border-red-600/30 transition-all duration-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-zinc-500 text-xs font-bold uppercase tracking-widest">Total Usuários</p>
              <p class="text-4xl font-black text-white mt-2 tracking-tighter" id="kpi-users">0</p>
              <div class="flex items-center gap-1 text-green-500 text-xs font-bold mt-3 bg-green-500/10 px-2 py-1 rounded-full w-fit">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3">
                  <path fill-rule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clip-rule="evenodd" />
                </svg>
                12% ↑
              </div>
            </div>
            <div class="bg-red-600/10 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8 text-red-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Total Filmes -->
        <div class="glass-panel group p-6 rounded-2xl border border-white/5 hover:border-blue-600/30 transition-all duration-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-zinc-500 text-xs font-bold uppercase tracking-widest">Total Conteúdo</p>
              <p class="text-4xl font-black text-white mt-2 tracking-tighter" id="kpi-movies">0</p>
              <div class="flex items-center gap-1 text-green-500 text-xs font-bold mt-3 bg-green-500/10 px-2 py-1 rounded-full w-fit">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3">
                  <path fill-rule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clip-rule="evenodd" />
                </svg>
                8% ↑
              </div>
            </div>
            <div class="bg-blue-600/10 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8 text-blue-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Perfis -->
        <div class="glass-panel group p-6 rounded-2xl border border-white/5 hover:border-purple-600/30 transition-all duration-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-zinc-500 text-xs font-bold uppercase tracking-widest">Perfis Ativos</p>
              <p class="text-4xl font-black text-white mt-2 tracking-tighter" id="kpi-profiles">0</p>
              <div class="flex items-center gap-1 text-green-500 text-xs font-bold mt-3 bg-green-500/10 px-2 py-1 rounded-full w-fit">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3">
                  <path fill-rule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clip-rule="evenodd" />
                </svg>
                15% ↑
              </div>
            </div>
            <div class="bg-purple-600/10 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8 text-purple-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Status Server -->
        <div class="glass-panel group p-6 rounded-2xl border border-white/5 hover:border-green-600/30 transition-all duration-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-zinc-500 text-xs font-bold uppercase tracking-widest">Status Server</p>
              <p class="text-4xl font-black text-white mt-2 tracking-tighter" id="kpi-status">---</p>
              <div class="flex items-center gap-1 text-green-500 text-xs font-bold mt-3 bg-green-500/10 px-2 py-1 rounded-full w-fit">
                <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-1"></span>
                Estável
              </div>
            </div>
            <div class="bg-green-600/10 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8 text-green-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Gráficos - Linha 1 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Gráfico de Crescimento -->
        <div class="lg:col-span-2 glass-panel rounded-3xl p-8 border border-white/5 overflow-hidden">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-2xl font-black text-white tracking-tight">Crescimento <span class="text-zinc-500 font-medium">Histórico</span></h2>
            <div class="flex gap-2">
              <span class="px-3 py-1 bg-white/5 text-zinc-400 text-xs rounded-md font-bold">7D</span>
              <span class="px-3 py-1 bg-red-600 text-white text-xs rounded-md font-bold">30D</span>
            </div>
          </div>
          <div id="chart-growth" class="min-h-[300px]"></div>
        </div>
        
        <!-- Gráfico de Espécies -->
        <div class="glass-panel rounded-3xl p-8 border border-white/5">
          <h2 class="text-2xl font-black text-white tracking-tight mb-8">Espécies</h2>
          <div id="chart-species" class="min-h-[300px]"></div>
        </div>
      </div>
      
      <!-- Gráficos - Linha 2 -->
      <div class="grid grid-cols-1 gap-6">
        <!-- Gráfico de Conteúdo por Categoria -->
        <div class="glass-panel rounded-3xl p-8 border border-white/5">
          <h2 class="text-2xl font-black text-white tracking-tight mb-8">Categorias de Conteúdo</h2>
          <div id="chart-content" class="min-h-[350px]"></div>
        </div>
      </div>
    </div>

  `;
}

export async function init() {
  // Aguarda um pouco para garantir que o DOM está pronto
  await new Promise(resolve => setTimeout(resolve, 100));

  // Configurar botão de seed
  const btnSeed = document.getElementById('btn-seed');
  if (btnSeed) {
    btnSeed.addEventListener('click', async () => {
      if (!confirm('Tem certeza que deseja popular o banco? Isso pode gerar duplicatas se já existirem dados.')) return;

      try {
        // Importação dinâmica para não pesar no bundle inicial
        const { seedDatabase } = await import('../../utils/seeder.js');
        const { Toast } = await import('../../utils/toast.js');

        const originalText = btnSeed.innerHTML;
        btnSeed.disabled = true;
        btnSeed.innerHTML = `
          <svg class="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Populando...
        `;

        const result = await seedDatabase();

        if (result.success) {
          Toast.success(result.message);
        } else {
          Toast.error((result.error || 'Erro desconhecido'));
        }

        // Restaurar botão após 2s
        setTimeout(() => {
          btnSeed.disabled = false;
          btnSeed.innerHTML = originalText;
        }, 2000);

      } catch (err) {
        console.error(err);
        alert('Erro ao executar seeder: ' + err.message);
        btnSeed.disabled = false;
        btnSeed.textContent = 'Erro ao popular';
      }
    });
  }

  try {
    // Busca estatísticas do Firestore
    dashboardStats = await getDashboardStats();

    // Atualiza os KPIs com dados reais
    updateKPIs();

    // Inicializa os gráficos com dados reais
    initGrowthChart();
    initSpeciesChart();
    initContentChart();
  } catch (error) {
    console.error('❌ Erro ao carregar dados do dashboard:', error);
    // Em caso de erro, inicializa com dados padrão
    dashboardStats = {
      totalUsers: 0,
      totalContent: 0,
      contentBySpecies: { dog: 0, cat: 0 },
      contentByCategory: { movie: 0, series: 0, doc: 0 },
      serverStatus: 'Offline'
    };
    updateKPIs();
    initGrowthChart();
    initSpeciesChart();
    initContentChart();
  }
}

/**
 * Atualiza os KPIs com dados reais do Firestore
 */
function updateKPIs() {
  if (!dashboardStats) return;

  // Atualiza Total Usuários
  const usersEl = document.getElementById('kpi-users');
  if (usersEl) {
    usersEl.textContent = dashboardStats.totalUsers.toLocaleString('pt-BR');
  }

  // Atualiza Total Filmes (conteúdo)
  const moviesEl = document.getElementById('kpi-movies');
  if (moviesEl) {
    moviesEl.textContent = dashboardStats.totalContent.toLocaleString('pt-BR');
  }

  // Atualiza Perfis (mantém fictício por enquanto, pois requer query complexa)
  const profilesEl = document.getElementById('kpi-profiles');
  if (profilesEl) {
    // TODO: Implementar contagem real de perfis ativos
    profilesEl.textContent = '2,890';
  }

  // Atualiza Status Server
  const statusEl = document.getElementById('kpi-status');
  if (statusEl) {
    statusEl.textContent = dashboardStats.serverStatus;
    // Atualiza cor baseado no status
    const statusSubtext = statusEl.parentElement.querySelector('.text-sm');
    if (statusSubtext) {
      if (dashboardStats.serverStatus === 'Online') {
        statusSubtext.classList.remove('text-red-400');
        statusSubtext.classList.add('text-green-400');
      } else {
        statusSubtext.classList.remove('text-green-400');
        statusSubtext.classList.add('text-red-400');
      }
    }
  }
}

/**
 * Gráfico de Crescimento de Usuários (Linha)
 * TODO: Implementar query complexa para buscar dados históricos de crescimento por data
 */
function initGrowthChart() {
  const options = {
    series: [{
      name: 'Usuários',
      data: [120, 190, 300, 500, 800, 1000, dashboardStats?.totalUsers || 1234]
    }],
    chart: {
      type: 'area',
      height: 300,
      toolbar: { show: false },
      background: 'transparent',
      fontFamily: 'Inter, sans-serif'
    },
    colors: [PETFLIX_RED],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100]
      }
    },
    stroke: {
      curve: 'smooth',
      width: 4
    },
    xaxis: {
      categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: '#71717a', fontWeight: 600 }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#71717a', fontWeight: 600 }
      }
    },
    grid: {
      borderColor: 'rgba(255,255,255,0.05)',
      strokeDashArray: 4,
      padding: { left: 20, right: 20 }
    },
    tooltip: { theme: 'dark' }
  };

  const chart = new ApexCharts(document.querySelector('#chart-growth'), options);
  chart.render();
}

function initSpeciesChart() {
  const dogCount = dashboardStats?.contentBySpecies?.dog || 0;
  const catCount = dashboardStats?.contentBySpecies?.cat || 0;

  const options = {
    series: [dogCount, catCount],
    chart: {
      type: 'donut',
      height: 300,
      fontFamily: 'Inter, sans-serif'
    },
    labels: ['Cachorros', 'Gatos'],
    colors: [PETFLIX_RED, '#2563EB'],
    stroke: { show: false },
    legend: {
      position: 'bottom',
      labels: { colors: '#a1a1aa', useSeriesColors: false },
      markers: { radius: 12 }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Distribuição',
              color: '#71717a',
              formatter: () => 'Pets'
            },
            value: {
              show: true,
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '24px'
            }
          }
        }
      }
    },
    tooltip: { theme: 'dark' }
  };

  const chart = new ApexCharts(document.querySelector('#chart-species'), options);
  chart.render();
}

function initContentChart() {
  const movieCount = dashboardStats?.contentByCategory?.movie || 0;
  const seriesCount = dashboardStats?.contentByCategory?.series || 0;
  const docCount = dashboardStats?.contentByCategory?.doc || 0;

  const options = {
    series: [{
      name: 'Quantidade',
      data: [movieCount, seriesCount, docCount]
    }],
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif'
    },
    colors: [PETFLIX_RED],
    plotOptions: {
      bar: {
        borderRadius: 12,
        columnWidth: '40%',
        distributed: false,
        dataLabels: { position: 'top' }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: ['#B20710'],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    dataLabels: {
      enabled: true,
      offsetY: -25,
      style: {
        fontSize: '12px',
        colors: ["#fff"],
        fontWeight: 900
      }
    },
    xaxis: {
      categories: ['Filmes', 'Séries', 'Documentários'],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: '#71717a', fontWeight: 600 }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#71717a', fontWeight: 600 }
      }
    },
    grid: {
      borderColor: 'rgba(255,255,255,0.05)',
      strokeDashArray: 4
    },
    tooltip: { theme: 'dark' }
  };

  const chart = new ApexCharts(document.querySelector('#chart-content'), options);
  chart.render();
}


export default { render, init };
