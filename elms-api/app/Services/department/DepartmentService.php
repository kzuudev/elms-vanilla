<?

namespace App\Services\department;

use Core\App;
use Core\Database;
use App\Http\Middleware\Auth;
use App\Exceptions\domain\NotFoundException;
use App\Exceptions\domain\ForbiddenException;
use Throwable;

class DepartmentService {

    private Database $db;
    private ?array $current_user;

    public function __construct() {

        $this->db = App::resolve(Database::class);
        $this->current_user = Auth::user();

    }

    public function getDepartments() {

        if($this->current_user['role'] !== 'super-admin') {
            throw new ForbiddenException('You are not authorized to access this resource');
        }

        $departments = $this->db->query("
            SELECT * FROM departments 
            WHERE deleted_at IS NULL
            ORDER BY created_at DESC
        ", [])->all();

        return $departments;

    }

    public function createDepartment(string $name) {

        if($this->current_user['role'] !== 'super-admin') {
            throw new ForbiddenException('You are not authorized to create a department');
        }

        try{
            $this->db->beginTransaction();

            $create_department = $this->db->query("
                INSERT INTO departments (name) VALUES (:name)
            ", [
                'name' => $name
            ]);
            
            $this->db->commit();
            return $create_department;

        }catch(Throwable $e) {
            $this->db->rollBack();
            throw $e;
        }
        

    }

    public function getDepartment(int $id) {

        if($this->current_user['role'] !== 'super-admin') {
            throw new ForbiddenException('You are not authorized to view a department details');

        }

        $department = $this->db->query("
            SELECT * FROM departments WHERE id = :id AND deleted_at IS NULL
            ORDER BY created_at DESC
        ", ['id' => $id])->find();
        
        if(!$department) {
            throw new NotFoundException('Department not found');
        }

        return $department;

    }

    public function updateDepartment(int $id, string $name) {
        
        if($this->current_user['role'] !== 'super-admin') {
            throw new ForbiddenException('You are not authorized to update a department');
        }

        try{
            $this->db->beginTransaction();

            $update_department = $this->db->query("
                UPDATE departments SET name = :name WHERE id = :id AND deleted_at IS NULL
            ", [
                'id' => $id,
                'name' => $name
            ]);

            if(!$update_department) {
                throw new NotFoundException('Department not found');
            }

            $this->db->commit();
            return $update_department;

        }catch(Throwable $e) {
            $this->db->rollBack();
            throw $e;
        }

    }

    public function deleteDepartment(int $id) {

        if($this->current_user['role'] !== 'super-admin') {
            throw new ForbiddenException('You are not authorized to delete a department');
        }

        try{
            $this->db->beginTransaction();

            $delete_department = $this->db->query("
                UPDATE departments SET deleted_at = NOW() WHERE id = :id AND deleted_at is NULL
            ", ['id' => $id]);

            if(!$delete_department) {
                throw new NotFoundException('Department not found');
            }

            $this->db->commit();
            return $delete_department;

        }catch(Throwable $e) {
            $this->db->rollBack();
            throw $e;
        }
    }
}