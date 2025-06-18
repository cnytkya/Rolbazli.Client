export interface UserDetail {
  id: string;          // Kullanıcı kimliği
  email: string;       // Kullanıcı e-posta adresi
  fullName: string;    // Kullanıcının tam adı
  roles: string[];     // Kullanıcının sahip olduğu rollerin dizisi
}
