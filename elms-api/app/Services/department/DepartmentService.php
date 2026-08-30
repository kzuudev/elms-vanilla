<?

namespace App\Services\department;

use Core\App;
use Core\Database;
use App\Http\Middleware\Auth;
use App\Exceptions\domain\NotFoundException;
use App\Exceptions\domain\UnauthorizedException;
use App\Exceptions\domain\BadRequestException;
use Throwable;

class DepartmentService {

    private Database $db;
    private ?array $current_user;

    public function __construct() {

        $this->db = App::resolve(Database::class);
        $this->current_user = Auth::user();

    }

    private function validateUser() {
        if($this->current_user['role'] !== 'super-admin') {
            throw new UnauthorizedException('You are not authorized to access this resource');
        }
    }

    public function getDepartments(string $department_name, string $sort_by = '') {

        $this->validateUser();

        $query = "
            SELECT * FROM departments 
            WHERE deleted_at IS NULL
        ";

        $params = [];

        if (!empty($department_name)) {
            $query .= " AND name = :department_name";
            $params['department_name'] = $department_name;
        }
        
        if (!empty($sort_by)) {
            $query .= " ORDER BY name ASC";
        }

        $departments = $this->db->query($query, $params)->all();

        return $departments;

    }

    public function createDepartment(string $name) {

        $this->validateUser();

        try{
            $this->db->beginTransaction();

            $existing_department = $this->db->query("
                SELECT * FROM departments WHERE name = :name AND deleted_at IS NULL
            ", [
                'name' => $name
            ])->find();

            if($existing_department) {
                throw new BadRequestException('Department with this name already exists');
            }   

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

        $this->validateUser();

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
        
        $this->validateUser();

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

        $this->validateUser();

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