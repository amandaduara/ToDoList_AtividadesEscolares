using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;

namespace ToDoList_AtividadesEscolares.Controllers
{
    [ApiController]
    [Route("api/atividades")]
    public class NovaAtividadeController : Controller
    {
        private readonly ILogger<NovaAtividadeController> _logger;

        private const string StringBD = "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=ToDoListEscolar;Integrated Security=True;Connect Timeout=30;Encrypt=False;Trust Server Certificate=False;Application Intent=ReadWrite;Multi Subnet Failover=False";
        public NovaAtividadeController(ILogger<NovaAtividadeController> logger)
        {
            _logger = logger;
        }

        [HttpPost]

        //metodo para inserir atividades
        public ActionResult AdicionarAtividade(NovaAtividade atividade)
        {
            using (SqlConnection connection = new SqlConnection(StringBD))
            {
                string query = "Insert into AdicionarTarefa (materia, descricao, data_atividade) values (@materia, @descricao, @data_atividade)";
                SqlCommand cmd = new SqlCommand(query, connection);
                cmd.Parameters.AddWithValue("@materia", atividade.materia);
                cmd.Parameters.AddWithValue("@descricao", atividade.descricao);
                cmd.Parameters.AddWithValue("@data_atividade", atividade.data_atividade);
                connection.Open();

                int rowsAffected = cmd.ExecuteNonQuery();
                if (rowsAffected > 0)
                {
                    return Ok();
                }
            }
            return BadRequest();

        }

        //metodo para exibir atividades
        [HttpGet("atividades", Name = "GetPagamentos")]

        public IEnumerable<NovaAtividade> GetAtividades()
        {
            List<NovaAtividade> atividades = new List<NovaAtividade>();

            using (SqlConnection connection = new SqlConnection(StringBD))
            {
                string query = "Select id_tarefa, materia, descricao, data_atividade from AdicionarTarefa";
                SqlCommand cmd = new SqlCommand(query, connection);
                connection.Open();

                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    NovaAtividade atividade = new NovaAtividade
                    {
                        id_tarefa = Convert.ToInt32(reader["id_tarefa"]),
                        materia = reader["materia"].ToString(),
                        descricao = reader["descricao"].ToString(),
                        data_atividade = DateOnly.FromDateTime(reader.GetDateTime("data_atividade"))

                    };

                    atividades.Add(atividade);
                }

                reader.Close();
            }

            return atividades;

        }

        //metodo para atualizar atividades
        [HttpPut("{id_tarefa}")]

        public ActionResult AtualizarAtividade(int id_tarefa, [FromBody] NovaAtividade atividade)
        {
            using (SqlConnection connection = new SqlConnection(StringBD))
            {
                string query = "Update AdicionarTarefa set materia = @materia, descricao = @descricao, data_atividade = @data_atividade where id_tarefa = @id_tarefa";
                SqlCommand cmd = new SqlCommand(query, connection);
                cmd.Parameters.AddWithValue("@id_tarefa", id_tarefa);
                cmd.Parameters.AddWithValue("@materia", atividade.materia);
                cmd.Parameters.AddWithValue("@descricao", atividade.descricao);
                cmd.Parameters.AddWithValue("@data_atividade", atividade.data_atividade);
                connection.Open();

                int rowsAffected = cmd.ExecuteNonQuery();

                if (rowsAffected > 0)
                {
                    return Ok();
                }
            }

            return NotFound();
        }

        //metodo para deletar atividades
        [HttpDelete("{id_tarefa}")]

        public ActionResult DeleteAtividade(int id_tarefa)
        {
            using (SqlConnection connection = new SqlConnection(StringBD))
            {
                string query = "Delete from AdicionarTarefa where id_tarefa = @id_tarefa";
                SqlCommand cmd = new SqlCommand(query, connection);
                cmd.Parameters.AddWithValue("@id_tarefa", id_tarefa);
                connection.Open();

                int rowsAffected = cmd.ExecuteNonQuery();

                if (rowsAffected > 0)
                {
                    return Ok();
                }
            }

            return NotFound();
        }
    }
}
