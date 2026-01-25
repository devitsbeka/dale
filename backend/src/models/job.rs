use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

// Basic Job entity to interact with Prisma-managed jobs table
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "jobs")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: String,
    pub external_id: String,
    pub source: String,
    pub title: String,
    pub company: String,
    pub company_logo: Option<String>,
    pub company_url: Option<String>,
    pub location: Option<String>,
    pub location_type: String,
    pub description: String,
    pub category: Option<String>,
    pub experience_level: Option<String>,
    pub employment_type: Option<String>,
    pub salary_min: Option<i32>,
    pub salary_max: Option<i32>,
    pub salary_currency: Option<String>,
    pub apply_url: String,
    pub published_at: Option<DateTime>,
    pub fetched_at: DateTime,
    pub created_at: DateTime,
    pub updated_at: DateTime,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
