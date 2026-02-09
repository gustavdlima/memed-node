import { MemedClient } from '../src';

async function main() {
    // Credenciais de testes da Memed (públicas na documentação)
    const memed = new MemedClient({
        apiKey: 'iJGiB4kjDGOLeDFPWMG3no9VnN7Abpqe3w1jEFm6olkhkZD6oSfSmYCm',
        secretKey: 'Xe8M5GvBGCr4FStKfxXKisRo3SfYKI7KrTMkJpCAstzu2yXVN4av5nmL',
        environment: 'integration',
    });

    console.log('🏥 Testando memed-node...\n');

    try {
        // Criar médico (CRM)
        console.log('📝 Criando prescritor (Médico)...');
        const medico = await memed.prescritor.create({
            external_id: `test-med-${Date.now()}`,
            nome: 'José',
            sobrenome: 'Silva',
            data_nascimento: '01/01/1985',
            cpf: '87671504203', // CPF de teste da doc
            sexo: 'M',
            board: {
                board_code: 'CRM',
                board_number: '54321',
                board_state: 'SP',
            },
            email: 'jose@exemplo.com',
        });

        console.log('✅ Médico criado!');
        console.log('   ID:', medico.id);
        console.log('   Nome:', medico.nome, medico.sobrenome);
        console.log('   Conselho:', medico.board.board_code, medico.board.board_number, '-', medico.board.board_state);
        console.log('   Token:', medico.token.substring(0, 20) + '...');
        console.log('   Status:', medico.status);

        // Criar dentista (CRO)
        console.log('\n📝 Criando prescritor (Dentista)...');
        const dentista = await memed.prescritor.create({
            external_id: `test-dent-${Date.now()}`,
            nome: 'Maria',
            sobrenome: 'Santos',
            data_nascimento: '15/03/1990',
            cpf: '12345678900',
            sexo: 'F',
            board: {
                board_code: 'CRO',
                board_number: '98765',
                board_state: 'RJ',
            },
            email: 'maria@exemplo.com',
        });

        console.log('✅ Dentista criada!');
        console.log('   Conselho:', dentista.board.board_code, dentista.board.board_number, '-', dentista.board.board_state);

        // Buscar prescritor
        console.log('\n🔍 Buscando prescritor...');
        const medicoEncontrado = await memed.prescritor.get(medico.external_id);
        console.log('✅ Prescritor encontrado:', medicoEncontrado.nome);

        // Listar prescritores
        console.log('\n📋 Listando prescritores...');
        const prescritores = await memed.prescritor.list();
        console.log(`✅ Total de ${prescritores.length} prescritores`);

        // Contar por tipo de conselho
        const medicos = prescritores.filter(p => p.board.board_code === 'CRM');
        const dentistas = prescritores.filter(p => p.board.board_code === 'CRO');
        console.log(`   - ${medicos.length} médicos (CRM)`);
        console.log(`   - ${dentistas.length} dentistas (CRO)`);

        // Atualizar prescritor
        console.log('\n✏️  Atualizando email...');
        const medicoAtualizado = await memed.prescritor.update(
            medico.external_id,
            {
                email: 'novoemail@exemplo.com',
            }
        );
        console.log('✅ Email atualizado:', medicoAtualizado.email);

        // Deletar prescritores
        console.log('\n🗑️  Deletando prescritores de teste...');
        await memed.prescritor.delete(medico.external_id);
        await memed.prescritor.delete(dentista.external_id);
        console.log('✅ Prescritores deletados com sucesso!');

        console.log('\n🎉 Todos os testes passaram!');
    } catch (error) {
        console.error('\n❌ Erro:', error);
        process.exit(1);
    }
}

main();