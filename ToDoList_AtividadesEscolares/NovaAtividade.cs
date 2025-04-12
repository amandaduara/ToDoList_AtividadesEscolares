namespace ToDoList_AtividadesEscolares
{
    public class NovaAtividade
    {
        public int id_tarefa { get; set; }
        public string materia {  get; set; }
        public string descricao {  get; set; }
        public DateOnly data_atividade { get; set; }

    }
}
