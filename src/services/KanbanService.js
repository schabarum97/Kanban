export async function fetchKanbanCards(id) {
    try {
      const response = await fetch(`sua_url_api/tarefas/${id}`);
  
      if (!response.ok) {
        throw new Error(`Erro: ${response.status} - ${response.statusText}`);
      }
  
      const textResponse = await response.text(); // Capture a resposta como texto
      console.log(textResponse); // Veja o que está retornando
      const data = JSON.parse(textResponse); // Tente converter o texto em JSON
      return data;
    } catch (error) {
      console.error("Erro ao buscar os cards:", error);
      throw error; // Re-throw para capturar no componente
    }
  }
  